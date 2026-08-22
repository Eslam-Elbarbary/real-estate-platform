'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LocationOption } from '@/features/locations';
import type { Property, PropertySearchFilters } from '@/types';
import {
  getBoundsForProperties,
  getPropertiesInsideBounds,
} from '../../lib/map-bounds';
import { groupPropertiesByMapProximity } from '../../lib/map-proximity';
import { getResultsCountLabel, getResultsHeading } from '../../lib/search-title';
import type { MapBounds, MapCluster, MapInteractionSource } from '../../types/map-search';
import { MapResultsPanel } from './map-results-panel';
import { PropertyMap } from './property-map';
import { SearchThisAreaButton } from './search-this-area-button';
import { MapListToggle } from './map-list-toggle';
import { uiLabels } from '@/config/labels';

interface PropertyMapExplorerProps {
  properties: Property[];
  filters: PropertySearchFilters;
  selectedLocation: LocationOption | null;
}

export function PropertyMapExplorer({
  properties,
  filters,
  selectedLocation,
}: PropertyMapExplorerProps) {
  const ordered = useMemo(
    () => groupPropertiesByMapProximity(properties),
    [properties],
  );
  const [visible, setVisible] = useState(ordered);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [userBounds, setUserBounds] = useState<MapBounds | null>(null);
  const [followBounds, setFollowBounds] = useState<MapBounds | null>(
    getBoundsForProperties(ordered),
  );
  const [followToken, setFollowToken] = useState(0);
  const [followSource, setFollowSource] = useState<MapInteractionSource>('initial');
  const [pauseListFollow, setPauseListFollow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibleIdsRef = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heading = selectedLocation
    ? `${getResultsHeading(filters)} في ${selectedLocation.name}`
    : getResultsHeading(filters);
  const countLabel = getResultsCountLabel(visible.length, filters);

  const locationCenter = ordered[0]
    ? { lat: ordered[0].location.latitude, lng: ordered[0].location.longitude }
    : null;

  const fitToIds = useCallback(
    (ids: string[], source: MapInteractionSource) => {
      const subset = ordered.filter((item) => ids.includes(item.id));
      const bounds = getBoundsForProperties(subset);
      if (!bounds) return;
      setFollowBounds(bounds);
      setFollowSource(source);
      setFollowToken((token) => token + 1);
    },
    [ordered],
  );

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.propertyId;
          if (!id) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            ratios.set(id, entry.intersectionRatio);
          } else {
            ratios.delete(id);
          }
        }
        if (pauseListFollow) return;
        const ids = [...ratios.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([id]) => id);
        const key = ids.slice().sort().join(',');
        if (!ids.length || key === visibleIdsRef.current) return;
        visibleIdsRef.current = key;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          fitToIds(ids, 'list-scroll');
        }, 150);
      },
      { root, threshold: [0.3, 0.5, 0.7] },
    );

    const observeAll = () => {
      root.querySelectorAll<HTMLElement>('[data-property-id]').forEach((node) => {
        observer.observe(node);
      });
    };
    observeAll();
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, fitToIds, pauseListFollow]);

  function handleMarkerClick(propertyId: string) {
    setActivePropertyId(propertyId);
    setPauseListFollow(true);
    fitToIds([propertyId], 'marker');
    const card = scrollRef.current?.querySelector<HTMLElement>(
      `[data-property-id="${propertyId}"]`,
    );
    card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleClusterClick(cluster: MapCluster) {
    setPauseListFollow(true);
    fitToIds(cluster.propertyIds, 'cluster');
  }

  function handleUserMove(bounds: MapBounds) {
    setUserBounds(bounds);
    setShowSearchArea(true);
    setPauseListFollow(true);
  }

  function handleSearchThisArea() {
    if (!userBounds) return;
    setVisible(getPropertiesInsideBounds(ordered, userBounds));
    setShowSearchArea(false);
    setPauseListFollow(false);
    setActivePropertyId(null);
    scrollRef.current?.scrollTo({ top: 0 });
  }

  return (
    <div
      data-testid="property-map-explorer"
      className="mt-3 overflow-hidden rounded-xl border border-border bg-white min-[1200px]:h-[calc(100dvh-11.75rem)]"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 min-[1200px]:hidden">
        <MapListToggle filters={filters} mode="map" />
        <span className="text-xs font-semibold text-ink-500">{uiLabels.showMap}</span>
      </div>

      <div className="grid h-[68dvh] min-[1200px]:h-full min-[1200px]:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.95fr)]">
        <div className="relative h-full min-h-[280px]">
          <PropertyMap
            properties={visible}
            activePropertyId={activePropertyId}
            hoveredPropertyId={hoveredPropertyId}
            locationCenter={locationCenter}
            onMarkerClick={handleMarkerClick}
            onClusterClick={handleClusterClick}
            onUserMove={handleUserMove}
            followBounds={followBounds}
            followToken={followToken}
            followSource={followSource}
          />
          <SearchThisAreaButton visible={showSearchArea} onClick={handleSearchThisArea} />
        </div>
        <div className="hidden h-full min-h-0 min-[1200px]:block">
          <MapResultsPanel
            heading={heading}
            countLabel={countLabel}
            filters={filters}
            properties={visible}
            activePropertyId={activePropertyId}
            onHover={setHoveredPropertyId}
            onFocusProperty={setActivePropertyId}
            onUserScroll={() => setPauseListFollow(false)}
            scrollRef={scrollRef}
          />
        </div>
      </div>
    </div>
  );
}
