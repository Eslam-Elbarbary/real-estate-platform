'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Property } from '@/types';
import { formatCompactCurrency } from '@/lib/formatting/currency';
import { buildPropertyMapClusters } from '../../lib/map-clustering';
import {
  EGYPT_CENTER,
  getBoundsForProperties,
  padBounds,
} from '../../lib/map-bounds';
import type { MapBounds, MapCluster, MapInteractionSource } from '../../types/map-search';

interface PropertyMapProps {
  properties: Property[];
  activePropertyId: string | null;
  hoveredPropertyId: string | null;
  locationCenter?: { lat: number; lng: number } | null;
  onMarkerClick: (propertyId: string) => void;
  onClusterClick: (cluster: MapCluster) => void;
  onUserMove: (bounds: MapBounds) => void;
  onProgrammaticMoveEnd?: (bounds: MapBounds, center: { lat: number; lng: number }) => void;
  followBounds: MapBounds | null;
  followToken: number;
  followSource: MapInteractionSource;
}

declare global {
  interface Window {
    __propertyMapLeaflet?: {
      getCenter: () => { lat: number; lng: number };
      panBy: (x: number, y: number) => void;
      getZoom: () => number;
    };
  }
}

export function PropertyMap({
  properties,
  activePropertyId,
  hoveredPropertyId,
  locationCenter,
  onMarkerClick,
  onClusterClick,
  onUserMove,
  onProgrammaticMoveEnd,
  followBounds,
  followToken,
  followSource,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const layerRef = useRef<import('leaflet').LayerGroup | null>(null);
  const programmaticRef = useRef(false);
  const userMovingRef = useRef(false);
  const zoomRef = useRef(13);
  const [zoomTick, setZoomTick] = useState(0);
  const callbacksRef = useRef({ onMarkerClick, onClusterClick, onUserMove, onProgrammaticMoveEnd });

  useEffect(() => {
    callbacksRef.current = { onMarkerClick, onClusterClick, onUserMove, onProgrammaticMoveEnd };
  }, [onMarkerClick, onClusterClick, onUserMove, onProgrammaticMoveEnd]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
      }).setView(
        [locationCenter?.lat ?? EGYPT_CENTER.lat, locationCenter?.lng ?? EGYPT_CENTER.lng],
        12,
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      zoomRef.current = map.getZoom();
      window.__propertyMapLeaflet = {
        getCenter: () => {
          const center = map.getCenter();
          return { lat: center.lat, lng: center.lng };
        },
        panBy: (x, y) => {
          userMovingRef.current = true;
          map.panBy([x, y]);
        },
        getZoom: () => map.getZoom(),
      };

      map.on('zoomend', () => {
        zoomRef.current = map.getZoom();
        setZoomTick((tick) => tick + 1);
      });
      map.on('dragstart zoomstart', () => {
        if (!programmaticRef.current) userMovingRef.current = true;
      });
      map.on('moveend', () => {
        const b = map.getBounds();
        const bounds: MapBounds = {
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        };
        const center = map.getCenter();
        if (programmaticRef.current) {
          programmaticRef.current = false;
          callbacksRef.current.onProgrammaticMoveEnd?.(bounds, {
            lat: center.lat,
            lng: center.lng,
          });
          return;
        }
        if (userMovingRef.current) {
          userMovingRef.current = false;
          callbacksRef.current.onUserMove(bounds);
        }
      });

      setTimeout(() => map.invalidateSize(), 80);
    }

    void setup();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      window.__propertyMapLeaflet = undefined;
    };
  }, [locationCenter?.lat, locationCenter?.lng]);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    void import('leaflet').then((L) => {
      layer.clearLayers();
      const clusters = buildPropertyMapClusters(properties, zoomRef.current);
      for (const cluster of clusters) {
        if (cluster.count > 1) {
          const icon = L.divIcon({
            className: 'map-cluster-icon',
            html: `<button type="button" data-testid="map-cluster" class="flex size-9 items-center justify-center rounded-full bg-brand-600 text-xs font-extrabold text-white shadow-md">${cluster.count}</button>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
          L.marker([cluster.center.lat, cluster.center.lng], { icon })
            .on('click', () => callbacksRef.current.onClusterClick(cluster))
            .addTo(layer);
          continue;
        }

        const property = properties.find((item) => item.id === cluster.propertyIds[0]);
        if (!property) continue;
        const active =
          property.id === activePropertyId || property.id === hoveredPropertyId;
        const label = formatCompactCurrency(property.price, property.currency);
        const icon = L.divIcon({
          className: 'map-price-icon',
          html: `<button type="button" data-testid="map-price-marker" data-property-id="${property.id}" class="rounded-full border px-2 py-0.5 text-[11px] font-bold shadow-sm ${
            active
              ? 'border-brand-700 bg-brand-600 text-white'
              : 'border-brand-600 bg-white text-brand-700'
          }">${label}</button>`,
          iconSize: [88, 28],
          iconAnchor: [44, 14],
        });
        L.marker([property.location.latitude, property.location.longitude], { icon })
          .on('click', () => callbacksRef.current.onMarkerClick(property.id))
          .addTo(layer);
      }
    });
  }, [properties, activePropertyId, hoveredPropertyId, followToken, zoomTick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = (bounds: MapBounds | null) => {
      if (!bounds) {
        const fallback = locationCenter ?? EGYPT_CENTER;
        programmaticRef.current = followSource !== 'user';
        map.setView([fallback.lat, fallback.lng], 11);
        return;
      }
      programmaticRef.current = followSource !== 'user';
      map.fitBounds(
        [
          [bounds.south, bounds.west],
          [bounds.north, bounds.east],
        ],
        { padding: [28, 28], maxZoom: 16, animate: followSource !== 'initial' },
      );
    };

    if (followBounds) {
      apply(padBounds(followBounds));
      return;
    }

    apply(getBoundsForProperties(properties));
  }, [followToken, followBounds, followSource, locationCenter, properties]);

  return (
    <div className="relative h-full min-h-[280px] w-full">
      <div
        ref={containerRef}
        data-testid="property-map"
        className="h-full w-full [&_.leaflet-control-zoom]:border-border [&_.leaflet-control-zoom-in]:text-ink-800"
      />
    </div>
  );
}
