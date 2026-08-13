import type { Property, PropertySeller } from '@/types';
import {
  buildCompoundUnitListings,
  normalizeSeedProperty,
} from './compound-unit-listings';

const seedProperties: Property[] = [
  {
    "id": "prop-1001",
    "referenceNumber": "EH-1001",
    "slug": "apartment-for-sale-fifth-settlement-1001",
    "title": "شقة ٣ غرف بحديقة للبيع في التجمع الخامس",
    "description": "وحدة سكنية بمساحة مناسبة للعائلة داخل كمبوند أوركيد بارك بالتجمع الخامس، مع توزيع عملي للغرف وصالة واسعة وإطلالة على الحديقة. الوحدة متاحة بنظام تقسيط مرن، وقريبة من الخدمات اليومية والمحاور الرئيسية. هذا الوصف مخصص للعرض التجريبي ويغطي تفاصيل العقار والموقع والمزايا المشتركة. يمكن معاينة صور إضافية ومقارنة الوحدات المشابهة في نفس المنطقة بسهولة.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 2600000,
    "pricePerSqm": 27368,
    "currency": "EGP",
    "area": 95,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 1,
    "finishingType": "semi_finished",
    "paymentType": "installment",
    "deliveryYear": 2025,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات، مع تقييمات جيدة للموقع والخدمات.",
    "compoundRatings": {
      "overall": 4.4,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.4
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.4
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.3
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.3
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.2
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.3
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.3
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.4
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-2-1",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-3-2",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-4-3",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-5-4",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-6-5",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-7-6",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-8-7",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-qa-1",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس",
        "isCover": false,
        "order": 20
      },
      {
        "id": "img-qa-2",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 2",
        "isCover": false,
        "order": 21
      },
      {
        "id": "img-qa-3",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 3",
        "isCover": false,
        "order": 22
      },
      {
        "id": "img-qa-4",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة ٣ غرف للبيع في التجمع الخامس - صورة 4",
        "isCover": false,
        "order": 23
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.5,
      "listingCount": 186
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "مصعد",
      "جراج مغطى",
      "شرفة",
      "عداد مياه",
      "غاز طبيعي",
      "تكييف مركزي",
      "موقف سيارات",
      "نظام إنذار",
      "حمام سباحة",
      "جيم",
      "حديقة خاصة",
      "بلكونة واسعة",
      "خزائن حائط",
      "تدفئة مركزية"
    ],
    "features": [
      "سكني",
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 1840,
    "favoritesCount": 96,
    "searchAppearances": 6420,
    "createdAt": "2026-04-02T10:00:00.000Z",
    "updatedAt": "2026-07-01T12:00:00.000Z",
    "downPayment": 260000,
    "installmentYears": 8,
    "monthlyInstallment": 24375,
    "gardenArea": 70
  },
  {
    "id": "prop-1002",
    "referenceNumber": "EH-1002",
    "slug": "apartment-for-sale-fifth-settlement-1002",
    "title": "شقة بحديقة للبيع في التجمع الخامس",
    "description": "وحدة شقة بحديقة للبيع بمساحة 112 م² في التجمع الخامس، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 2875000,
    "pricePerSqm": 25670,
    "currency": "EGP",
    "area": 112,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 2,
    "finishingType": "lux",
    "paymentType": "installment",
    "downPayment": 287500,
    "installmentYears": 6,
    "monthlyInstallment": 35938,
    "deliveryYear": 2025,
    "viewType": "شارع رئيسي",
    "gardenArea": 50,
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 3.7,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.7
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.8
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.1
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.2
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.3
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.4
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.6
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-3-1",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة بحديقة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-4-2",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة بحديقة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-5-3",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بحديقة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-6-4",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة بحديقة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-7-5",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة بحديقة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-8-6",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة بحديقة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-9-7",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة بحديقة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-10-8",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة بحديقة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "خزائن حائط",
      "حديقة خاصة",
      "حمام سباحة",
      "شرفة",
      "أمن",
      "هاتف أرضي",
      "مصعد"
    ],
    "features": [
      "شقة بحديقة",
      "تطل على حديقة"
    ],
    "verificationState": "verified",
    "views": 161,
    "favoritesCount": 8,
    "searchAppearances": 837,
    "createdAt": "2026-05-03T10:00:00.000Z",
    "updatedAt": "2026-07-02T12:00:00.000Z"
  },
  {
    "id": "prop-1003",
    "referenceNumber": "EH-1003",
    "slug": "apartment-for-sale-fifth-settlement-1003",
    "title": "شقة واسعة للبيع في التجمع الخامس",
    "description": "وحدة شقة واسعة للبيع بمساحة 129 م² في التجمع الخامس، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 3150000,
    "pricePerSqm": 24419,
    "currency": "EGP",
    "area": 129,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 3,
    "finishingType": "super_lux",
    "paymentType": "cash_or_installment",
    "downPayment": 472500,
    "installmentYears": 7,
    "monthlyInstallment": 31875,
    "deliveryYear": 2026,
    "viewType": "مفتوح",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 3.8,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.8
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.1
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.2
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.3
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.4
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.6
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.7
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-4-1",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة واسعة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-5-2",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة واسعة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-6-3",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة واسعة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-7-4",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة واسعة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-8-5",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة واسعة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-9-6",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة واسعة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-10-7",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة واسعة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-11-8",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة واسعة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-12-9",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة واسعة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "شرفة",
      "حديقة خاصة",
      "جيم",
      "غاز طبيعي",
      "حمام سباحة",
      "جراج مغطى",
      "خزائن حائط",
      "أمن"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 202,
    "favoritesCount": 11,
    "searchAppearances": 874,
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-07-03T12:00:00.000Z"
  },
  {
    "id": "prop-1004",
    "referenceNumber": "EH-1004",
    "slug": "apartment-for-sale-fifth-settlement-1004",
    "title": "شقة دور كامل للبيع في التجمع الخامس",
    "description": "وحدة شقة دور كامل للبيع بمساحة 131 م² في التجمع الخامس، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 3425000,
    "pricePerSqm": 26145,
    "currency": "EGP",
    "area": 131,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 4,
    "finishingType": "semi_finished",
    "paymentType": "cash",
    "deliveryYear": 2027,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "images": [
      {
        "id": "img-5-1",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة دور كامل للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-6-2",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة دور كامل للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-7-3",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة دور كامل للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-8-4",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة دور كامل للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-9-5",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة دور كامل للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-10-6",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة دور كامل للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-11-7",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة دور كامل للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-12-8",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة دور كامل للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-13-9",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة دور كامل للبيع - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-14-10",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة دور كامل للبيع - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "هاتف أرضي",
      "عداد مياه",
      "شرفة",
      "حديقة خاصة",
      "جيم",
      "غاز طبيعي",
      "حمام سباحة",
      "جراج مغطى",
      "أمن"
    ],
    "features": [
      "دور كامل"
    ],
    "verificationState": "verified",
    "views": 243,
    "favoritesCount": 14,
    "searchAppearances": 911,
    "createdAt": "2026-07-05T10:00:00.000Z",
    "updatedAt": "2026-07-04T12:00:00.000Z"
  },
  {
    "id": "prop-1005",
    "referenceNumber": "EH-1005",
    "slug": "apartment-for-sale-fifth-settlement-1005",
    "title": "شقة سكنية للبيع في التجمع الخامس",
    "description": "وحدة شقة سكنية للبيع بمساحة 148 م² في التجمع الخامس، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 3340000,
    "pricePerSqm": 22568,
    "currency": "EGP",
    "area": 148,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 5,
    "finishingType": "finished",
    "paymentType": "installment",
    "downPayment": 167000,
    "installmentYears": 9,
    "monthlyInstallment": 29380,
    "deliveryYear": 2024,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "images": [
      {
        "id": "img-6-1",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة سكنية للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-7-2",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة سكنية للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-8-3",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة سكنية للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-9-4",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة سكنية للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-10-5",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة سكنية للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-11-6",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة سكنية للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "أمن",
      "نظام إنذار",
      "تكييف مركزي",
      "هاتف أرضي",
      "عداد مياه",
      "شرفة",
      "غاز طبيعي",
      "حمام سباحة",
      "حديقة خاصة",
      "تدفئة مركزية"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 284,
    "favoritesCount": 17,
    "searchAppearances": 948,
    "createdAt": "2026-08-06T10:00:00.000Z",
    "updatedAt": "2026-07-05T12:00:00.000Z"
  },
  {
    "id": "prop-1006",
    "referenceNumber": "EH-1006",
    "slug": "apartment-for-sale-fifth-settlement-1006",
    "title": "شقة استثمارية للبيع في التجمع الخامس",
    "description": "وحدة شقة استثمارية للبيع بمساحة 165 م² في التجمع الخامس، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 3615000,
    "pricePerSqm": 21909,
    "currency": "EGP",
    "area": 165,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 6,
    "finishingType": "lux",
    "paymentType": "cash_or_installment",
    "downPayment": 361500,
    "installmentYears": 10,
    "monthlyInstallment": 27113,
    "deliveryYear": 2025,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4.2,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.2
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.3
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.4
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.6
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.7
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.8
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.9
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.6
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-7-1",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة استثمارية للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-8-2",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة استثمارية للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-9-3",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة استثمارية للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-10-4",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة استثمارية للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-11-5",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة استثمارية للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-12-6",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة استثمارية للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-13-7",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة استثمارية للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "مصعد",
      "موقف سيارات",
      "أمن",
      "تدفئة مركزية",
      "هاتف أرضي",
      "جراج مغطى",
      "نظام إنذار",
      "تكييف مركزي",
      "عداد مياه",
      "شرفة",
      "غاز طبيعي"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "pending",
    "views": 325,
    "favoritesCount": 20,
    "searchAppearances": 985,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-07-06T12:00:00.000Z"
  },
  {
    "id": "prop-1007",
    "referenceNumber": "EH-1007",
    "slug": "apartment-for-sale-fifth-settlement-1007",
    "title": "شقة حديثة للبيع في التجمع الخامس",
    "description": "وحدة شقة حديثة للبيع بمساحة 167 م² في التجمع الخامس، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 3890000,
    "pricePerSqm": 23293,
    "currency": "EGP",
    "area": 167,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 7,
    "finishingType": "super_lux",
    "paymentType": "cash",
    "deliveryYear": 2026,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 4.3,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.3
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.4
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.6
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.7
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.8
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.9
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.6
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.7
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-8-1",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة حديثة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-9-2",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة حديثة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-10-3",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة حديثة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-11-4",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة حديثة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-12-5",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة حديثة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-13-6",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة حديثة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-14-7",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة حديثة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-15-8",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة حديثة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "بلكونة واسعة",
      "مصعد",
      "موقف سيارات",
      "أمن",
      "هاتف أرضي",
      "جراج مغطى",
      "نظام إنذار",
      "تدفئة مركزية",
      "تكييف مركزي",
      "عداد مياه",
      "شرفة",
      "غاز طبيعي"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 366,
    "favoritesCount": 23,
    "searchAppearances": 1022,
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-07-07T12:00:00.000Z"
  },
  {
    "id": "prop-1008",
    "referenceNumber": "EH-1008",
    "slug": "apartment-for-sale-fifth-settlement-1008",
    "title": "شقة فاخرة للبيع في التجمع الخامس",
    "description": "وحدة شقة فاخرة للبيع بمساحة 184 م² في التجمع الخامس، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4165000,
    "pricePerSqm": 22636,
    "currency": "EGP",
    "area": 184,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 8,
    "finishingType": "semi_finished",
    "paymentType": "installment",
    "downPayment": 833000,
    "installmentYears": 6,
    "monthlyInstallment": 46278,
    "deliveryYear": 2027,
    "viewType": "شارع رئيسي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 4.4,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.4
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.6
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.7
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.8
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.9
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 3.6
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.7
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.8
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-9-1",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة فاخرة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-10-2",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة فاخرة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-11-3",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة فاخرة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-12-4",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة فاخرة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-13-5",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة فاخرة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-14-6",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة فاخرة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-15-7",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة فاخرة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-16-8",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة فاخرة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-17-9",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة فاخرة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "مصعد",
      "أمن",
      "هاتف أرضي",
      "جراج مغطى",
      "شرفة",
      "عداد مياه"
    ],
    "features": [
      "سكني",
      "تشطيب كامل"
    ],
    "verificationState": "verified",
    "views": 407,
    "favoritesCount": 26,
    "searchAppearances": 1059,
    "createdAt": "2026-06-09T10:00:00.000Z",
    "updatedAt": "2026-07-08T12:00:00.000Z"
  },
  {
    "id": "prop-1009",
    "referenceNumber": "EH-1009",
    "slug": "apartment-for-sale-fifth-settlement-1009",
    "title": "شقة مطلة على حديقة للبيع في التجمع الخامس",
    "description": "وحدة شقة مطلة على حديقة للبيع بمساحة 201 م² في التجمع الخامس، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4080000,
    "pricePerSqm": 20299,
    "currency": "EGP",
    "area": 201,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 9,
    "finishingType": "finished",
    "paymentType": "cash_or_installment",
    "downPayment": 204000,
    "installmentYears": 7,
    "monthlyInstallment": 46143,
    "deliveryYear": 2024,
    "viewType": "مفتوح",
    "gardenArea": 70,
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "images": [
      {
        "id": "img-10-1",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة مطلة على حديقة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-11-2",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-12-3",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-13-4",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-14-5",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-15-6",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-16-7",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-17-8",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-18-9",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-19-10",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة مطلة على حديقة للبيع - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "خزائن حائط",
      "بلكونة واسعة",
      "حديقة خاصة",
      "حمام سباحة",
      "شرفة"
    ],
    "features": [
      "شقة بحديقة"
    ],
    "verificationState": "verified",
    "views": 448,
    "favoritesCount": 29,
    "searchAppearances": 1096,
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-09T12:00:00.000Z"
  },
  {
    "id": "prop-1010",
    "referenceNumber": "EH-1010",
    "slug": "apartment-for-sale-madinaty-1010",
    "title": "شقة عائلية للبيع في مدينتي",
    "description": "وحدة شقة عائلية للبيع بمساحة 203 م² في مدينتي، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4355000,
    "pricePerSqm": 21453,
    "currency": "EGP",
    "area": 203,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 10,
    "finishingType": "lux",
    "paymentType": "cash",
    "deliveryYear": 2025,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "madinaty",
      "areaName": "مدينتي",
      "latitude": 30.1001,
      "longitude": 31.637
    },
    "images": [
      {
        "id": "img-11-1",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة عائلية للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-12-2",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة عائلية للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-13-3",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة عائلية للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-14-4",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة عائلية للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-15-5",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة عائلية للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-16-6",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة عائلية للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "أمن",
      "حمام سباحة",
      "حديقة خاصة",
      "جيم",
      "غاز طبيعي",
      "جراج مغطى",
      "هاتف أرضي",
      "شرفة"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 489,
    "favoritesCount": 32,
    "searchAppearances": 1133,
    "createdAt": "2026-08-11T10:00:00.000Z",
    "updatedAt": "2026-07-10T12:00:00.000Z"
  },
  {
    "id": "prop-1011",
    "referenceNumber": "EH-1011",
    "slug": "apartment-for-sale-sheikh-zayed-1011",
    "title": "شقة بتشطيب كامل للبيع في الشيخ زايد",
    "description": "وحدة شقة بتشطيب كامل للبيع بمساحة 220 م² في الشيخ زايد، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4630000,
    "pricePerSqm": 21045,
    "currency": "EGP",
    "area": 220,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 1,
    "finishingType": "super_lux",
    "paymentType": "installment",
    "downPayment": 694500,
    "installmentYears": 9,
    "monthlyInstallment": 36440,
    "deliveryYear": 2026,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "sheikh-zayed",
      "cityName": "الشيخ زايد",
      "areaSlug": "sheikh-zayed",
      "areaName": "الشيخ زايد",
      "latitude": 30.0264,
      "longitude": 30.9695
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4.8,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.8
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.9
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.6
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 3.7
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 3.8
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.1
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.2
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-12-1",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة بتشطيب كامل للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-13-2",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-14-3",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-15-4",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-16-5",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-17-6",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-18-7",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة بتشطيب كامل للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "هاتف أرضي",
      "أمن",
      "مصعد",
      "جراج مغطى",
      "حمام سباحة",
      "جيم",
      "حديقة خاصة",
      "خزائن حائط",
      "غاز طبيعي"
    ],
    "features": [
      "تشطيب كامل"
    ],
    "verificationState": "pending",
    "views": 530,
    "favoritesCount": 35,
    "searchAppearances": 1170,
    "createdAt": "2026-04-12T10:00:00.000Z",
    "updatedAt": "2026-07-11T12:00:00.000Z"
  },
  {
    "id": "prop-1012",
    "referenceNumber": "EH-1012",
    "slug": "apartment-for-sale-nasr-city-1012",
    "title": "شقة قريبة من الخدمات للبيع في مدينة نصر",
    "description": "وحدة شقة قريبة من الخدمات للبيع بمساحة 237 م² في مدينة نصر، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4905000,
    "pricePerSqm": 20696,
    "currency": "EGP",
    "area": 237,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 2,
    "finishingType": "semi_finished",
    "paymentType": "cash_or_installment",
    "downPayment": 981000,
    "installmentYears": 10,
    "monthlyInstallment": 32700,
    "deliveryYear": 2027,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "nasr-city",
      "cityName": "مدينة نصر",
      "areaSlug": "nasr-city",
      "areaName": "مدينة نصر",
      "latitude": 30.0626,
      "longitude": 31.3497
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 4.9,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.9
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.6
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.7
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 3.8
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.1
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.2
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.3
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-13-1",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة قريبة من الخدمات للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-14-2",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-15-3",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-16-4",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-17-5",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-18-6",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-19-7",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-20-8",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة قريبة من الخدمات للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "تدفئة مركزية",
      "نظام إنذار",
      "تكييف مركزي",
      "هاتف أرضي",
      "أمن",
      "مصعد",
      "جراج مغطى",
      "غاز طبيعي",
      "حمام سباحة",
      "جيم"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 571,
    "favoritesCount": 38,
    "searchAppearances": 1207,
    "createdAt": "2026-05-13T10:00:00.000Z",
    "updatedAt": "2026-07-12T12:00:00.000Z"
  },
  {
    "id": "prop-1013",
    "referenceNumber": "EH-1013",
    "slug": "apartment-for-sale-6th-october-1013",
    "title": "شقة بإطلالة مفتوحة للبيع في ٦ أكتوبر",
    "description": "وحدة شقة بإطلالة مفتوحة للبيع بمساحة 95 م² في ٦ أكتوبر، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 4820000,
    "pricePerSqm": 50737,
    "currency": "EGP",
    "area": 95,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 3,
    "finishingType": "finished",
    "paymentType": "cash",
    "deliveryYear": 2024,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "6th-october",
      "cityName": "٦ أكتوبر",
      "areaSlug": "6th-october",
      "areaName": "٦ أكتوبر",
      "latitude": 29.9381,
      "longitude": 30.9138
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 3.6,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.6
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.7
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.8
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.1
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.2
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.3
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.4
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-14-1",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-15-2",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-16-3",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-17-4",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-18-5",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-19-6",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-20-7",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-21-8",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-22-9",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بإطلالة مفتوحة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "مصعد",
      "جراج مغطى",
      "عداد مياه",
      "غاز طبيعي",
      "تكييف مركزي",
      "تدفئة مركزية",
      "نظام إنذار",
      "موقف سيارات",
      "هاتف أرضي",
      "أمن",
      "شرفة"
    ],
    "features": [
      "إطلالة مفتوحة"
    ],
    "verificationState": "verified",
    "views": 612,
    "favoritesCount": 41,
    "searchAppearances": 1244,
    "createdAt": "2026-06-14T10:00:00.000Z",
    "updatedAt": "2026-07-13T12:00:00.000Z"
  },
  {
    "id": "prop-1014",
    "referenceNumber": "EH-1014",
    "slug": "apartment-for-sale-smouha-1014",
    "title": "شقة مناسبة للسكن الفوري في سموحة",
    "description": "وحدة شقة مناسبة للسكن الفوري بمساحة 112 م² في سموحة، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 5095000,
    "pricePerSqm": 45491,
    "currency": "EGP",
    "area": 112,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 4,
    "finishingType": "lux",
    "paymentType": "installment",
    "downPayment": 509500,
    "installmentYears": 6,
    "monthlyInstallment": 63688,
    "deliveryYear": 2025,
    "viewType": "شارع رئيسي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "alexandria",
      "governorateName": "الإسكندرية",
      "citySlug": "alexandria",
      "cityName": "الإسكندرية",
      "areaSlug": "smouha",
      "areaName": "سموحة",
      "latitude": 31.2165,
      "longitude": 29.944
    },
    "images": [
      {
        "id": "img-15-1",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة مناسبة للسكن الفوري",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-16-2",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-17-3",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-18-4",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-19-5",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-20-6",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-21-7",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-22-8",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-23-9",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-24-10",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة مناسبة للسكن الفوري - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "هاتف أرضي",
      "تدفئة مركزية",
      "بلكونة واسعة",
      "تكييف مركزي",
      "موقف سيارات",
      "مصعد",
      "عداد مياه",
      "أمن",
      "جراج مغطى",
      "شرفة",
      "غاز طبيعي",
      "نظام إنذار"
    ],
    "features": [
      "استلام فوري"
    ],
    "verificationState": "verified",
    "views": 653,
    "favoritesCount": 44,
    "searchAppearances": 1281,
    "createdAt": "2026-07-15T10:00:00.000Z",
    "updatedAt": "2026-07-14T12:00:00.000Z"
  },
  {
    "id": "prop-1015",
    "referenceNumber": "EH-1015",
    "slug": "apartment-for-sale-rehab-1015",
    "title": "شقة في موقع حيوي للبيع في الرحاب",
    "description": "وحدة شقة في موقع حيوي للبيع بمساحة 129 م² في الرحاب، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 5370000,
    "pricePerSqm": 41628,
    "currency": "EGP",
    "area": 129,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 5,
    "finishingType": "super_lux",
    "paymentType": "cash_or_installment",
    "downPayment": 805500,
    "installmentYears": 7,
    "monthlyInstallment": 54339,
    "deliveryYear": 2026,
    "viewType": "مفتوح",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "rehab",
      "areaName": "الرحاب",
      "latitude": 30.058,
      "longitude": 31.492
    },
    "images": [
      {
        "id": "img-16-1",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة في موقع حيوي للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-17-2",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة في موقع حيوي للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-18-3",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة في موقع حيوي للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-19-4",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة في موقع حيوي للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-20-5",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة في موقع حيوي للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-21-6",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة في موقع حيوي للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "أمن",
      "خزائن حائط",
      "هاتف أرضي",
      "بلكونة واسعة",
      "مصعد",
      "جراج مغطى"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 694,
    "favoritesCount": 47,
    "searchAppearances": 1318,
    "createdAt": "2026-08-16T10:00:00.000Z",
    "updatedAt": "2026-07-15T12:00:00.000Z"
  },
  {
    "id": "prop-1016",
    "referenceNumber": "EH-1016",
    "slug": "apartment-for-sale-heliopolis-1016",
    "title": "شقة بغرفتين وصالة للبيع في مصر الجديدة",
    "description": "وحدة شقة بغرفتين وصالة للبيع بمساحة 131 م² في مصر الجديدة، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 5645000,
    "pricePerSqm": 43092,
    "currency": "EGP",
    "area": 131,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 6,
    "finishingType": "semi_finished",
    "paymentType": "cash",
    "deliveryYear": 2027,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "heliopolis",
      "cityName": "مصر الجديدة",
      "areaSlug": "heliopolis",
      "areaName": "مصر الجديدة",
      "latitude": 30.091,
      "longitude": 31.322
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.1
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.2
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.3
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.4
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.6
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.7
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.8
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-17-1",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة بغرفتين وصالة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-18-2",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-19-3",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-20-4",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-21-5",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-22-6",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-23-7",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة بغرفتين وصالة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "مصعد",
      "جراج مغطى",
      "حديقة خاصة",
      "حمام سباحة",
      "بلكونة واسعة"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "pending",
    "views": 735,
    "favoritesCount": 5,
    "searchAppearances": 1355,
    "createdAt": "2026-04-17T10:00:00.000Z",
    "updatedAt": "2026-07-16T12:00:00.000Z"
  },
  {
    "id": "prop-1017",
    "referenceNumber": "EH-1017",
    "slug": "apartment-for-sale-fifth-settlement-1017",
    "title": "شقة بثلاث غرف ومطبخ أمريكي في التجمع الخامس",
    "description": "وحدة شقة بثلاث غرف ومطبخ أمريكي بمساحة 148 م² في التجمع الخامس، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 5560000,
    "pricePerSqm": 37568,
    "currency": "EGP",
    "area": 148,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 7,
    "finishingType": "finished",
    "paymentType": "installment",
    "downPayment": 278000,
    "installmentYears": 9,
    "monthlyInstallment": 48907,
    "deliveryYear": 2024,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 4.1,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.1
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.2
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.3
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.4
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.6
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.7
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.8
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.9
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-18-1",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-19-2",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-20-3",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-21-4",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-22-5",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-23-6",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-24-7",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-25-8",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة بثلاث غرف ومطبخ أمريكي - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "غاز طبيعي",
      "جيم",
      "جراج مغطى",
      "خزائن حائط",
      "شرفة",
      "أمن",
      "هاتف أرضي",
      "مصعد"
    ],
    "features": [
      "مطبخ أمريكي"
    ],
    "verificationState": "verified",
    "views": 776,
    "favoritesCount": 8,
    "searchAppearances": 1392,
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-07-17T12:00:00.000Z"
  },
  {
    "id": "prop-1018",
    "referenceNumber": "EH-1018",
    "slug": "apartment-for-sale-madinaty-1018",
    "title": "شقة في كمبوند هادئ للبيع في مدينتي",
    "description": "وحدة شقة في كمبوند هادئ للبيع بمساحة 165 م² في مدينتي، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 5835000,
    "pricePerSqm": 35364,
    "currency": "EGP",
    "area": 165,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 8,
    "finishingType": "lux",
    "paymentType": "cash_or_installment",
    "downPayment": 583500,
    "installmentYears": 10,
    "monthlyInstallment": 43763,
    "deliveryYear": 2025,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "madinaty",
      "areaName": "مدينتي",
      "latitude": 30.1001,
      "longitude": 31.637
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 4.2,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.2
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.3
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.4
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.6
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.7
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.8
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.9
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.6
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-19-1",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة في كمبوند هادئ للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-20-2",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-21-3",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-22-4",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-23-5",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-24-6",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-25-7",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-26-8",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-27-9",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة في كمبوند هادئ للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "جراج مغطى",
      "شرفة",
      "عداد مياه",
      "غاز طبيعي",
      "جيم",
      "حديقة خاصة",
      "حمام سباحة",
      "خزائن حائط",
      "هاتف أرضي"
    ],
    "features": [
      "داخل كمبوند"
    ],
    "verificationState": "verified",
    "views": 817,
    "favoritesCount": 11,
    "searchAppearances": 1429,
    "createdAt": "2026-06-19T10:00:00.000Z",
    "updatedAt": "2026-07-18T12:00:00.000Z"
  },
  {
    "id": "prop-1019",
    "referenceNumber": "EH-1019",
    "slug": "apartment-for-sale-sheikh-zayed-1019",
    "title": "شقة بإطلالة شارع رئيسي في الشيخ زايد",
    "description": "وحدة شقة بإطلالة شارع رئيسي بمساحة 167 م² في الشيخ زايد، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 6110000,
    "pricePerSqm": 36587,
    "currency": "EGP",
    "area": 167,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 9,
    "finishingType": "super_lux",
    "paymentType": "cash",
    "deliveryYear": 2026,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "sheikh-zayed",
      "cityName": "الشيخ زايد",
      "areaSlug": "sheikh-zayed",
      "areaName": "الشيخ زايد",
      "latitude": 30.0264,
      "longitude": 30.9695
    },
    "images": [
      {
        "id": "img-20-1",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة بإطلالة شارع رئيسي",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-21-2",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-22-3",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-23-4",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-24-5",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-25-6",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-26-7",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-27-8",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-28-9",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-29-10",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة بإطلالة شارع رئيسي - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "هاتف أرضي",
      "تدفئة مركزية",
      "نظام إنذار",
      "تكييف مركزي",
      "جراج مغطى",
      "شرفة",
      "عداد مياه",
      "غاز طبيعي",
      "جيم",
      "أمن"
    ],
    "features": [
      "شارع رئيسي"
    ],
    "verificationState": "verified",
    "views": 858,
    "favoritesCount": 14,
    "searchAppearances": 1466,
    "createdAt": "2026-07-20T10:00:00.000Z",
    "updatedAt": "2026-07-19T12:00:00.000Z"
  },
  {
    "id": "prop-1020",
    "referenceNumber": "EH-1020",
    "slug": "apartment-for-sale-nasr-city-1020",
    "title": "شقة بمدخل خاص للبيع في مدينة نصر",
    "description": "وحدة شقة بمدخل خاص للبيع بمساحة 184 م² في مدينة نصر، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 6385000,
    "pricePerSqm": 34701,
    "currency": "EGP",
    "area": 184,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 10,
    "finishingType": "semi_finished",
    "paymentType": "installment",
    "downPayment": 1277000,
    "installmentYears": 6,
    "monthlyInstallment": 70944,
    "deliveryYear": 2027,
    "viewType": "شارع رئيسي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "nasr-city",
      "cityName": "مدينة نصر",
      "areaSlug": "nasr-city",
      "areaName": "مدينة نصر",
      "latitude": 30.0626,
      "longitude": 31.3497
    },
    "images": [
      {
        "id": "img-21-1",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة بمدخل خاص للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-22-2",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بمدخل خاص للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-23-3",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة بمدخل خاص للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-24-4",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة بمدخل خاص للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-25-5",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة بمدخل خاص للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-26-6",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة بمدخل خاص للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "أمن",
      "نظام إنذار",
      "تدفئة مركزية",
      "موقف سيارات",
      "تكييف مركزي",
      "عداد مياه",
      "غاز طبيعي",
      "جراج مغطى",
      "مصعد",
      "هاتف أرضي",
      "شرفة"
    ],
    "features": [
      "مدخل خاص"
    ],
    "verificationState": "verified",
    "views": 899,
    "favoritesCount": 17,
    "searchAppearances": 1503,
    "createdAt": "2026-08-21T10:00:00.000Z",
    "updatedAt": "2026-07-20T12:00:00.000Z"
  },
  {
    "id": "prop-1021",
    "referenceNumber": "EH-1021",
    "slug": "apartment-for-sale-6th-october-1021",
    "title": "شقة بروف صغير للبيع في ٦ أكتوبر",
    "description": "وحدة شقة بروف صغير للبيع بمساحة 201 م² في ٦ أكتوبر، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 6300000,
    "pricePerSqm": 31343,
    "currency": "EGP",
    "area": 201,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 1,
    "finishingType": "finished",
    "paymentType": "cash_or_installment",
    "downPayment": 315000,
    "installmentYears": 7,
    "monthlyInstallment": 71250,
    "deliveryYear": 2024,
    "viewType": "مفتوح",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "6th-october",
      "cityName": "٦ أكتوبر",
      "areaSlug": "6th-october",
      "areaName": "٦ أكتوبر",
      "latitude": 29.9381,
      "longitude": 30.9138
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4.6,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.6
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.7
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.8
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.9
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 3.6
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 3.7
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.8
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-22-1",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة بروف صغير للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-23-2",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة بروف صغير للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-24-3",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة بروف صغير للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-25-4",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة بروف صغير للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-26-5",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة بروف صغير للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-27-6",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة بروف صغير للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-28-7",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بروف صغير للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "أمن",
      "مصعد",
      "موقف سيارات",
      "بلكونة واسعة",
      "هاتف أرضي",
      "جراج مغطى",
      "نظام إنذار",
      "تدفئة مركزية",
      "تكييف مركزي",
      "شرفة",
      "عداد مياه",
      "غاز طبيعي"
    ],
    "features": [
      "روف"
    ],
    "verificationState": "pending",
    "views": 940,
    "favoritesCount": 20,
    "searchAppearances": 1540,
    "createdAt": "2026-04-02T10:00:00.000Z",
    "updatedAt": "2026-07-21T12:00:00.000Z"
  },
  {
    "id": "prop-1022",
    "referenceNumber": "EH-1022",
    "slug": "apartment-for-sale-smouha-1022",
    "title": "شقة في برج حديث للبيع في سموحة",
    "description": "وحدة شقة في برج حديث للبيع بمساحة 203 م² في سموحة، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 6575000,
    "pricePerSqm": 32389,
    "currency": "EGP",
    "area": 203,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 2,
    "finishingType": "lux",
    "paymentType": "cash",
    "deliveryYear": 2025,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "alexandria",
      "governorateName": "الإسكندرية",
      "citySlug": "alexandria",
      "cityName": "الإسكندرية",
      "areaSlug": "smouha",
      "areaName": "سموحة",
      "latitude": 31.2165,
      "longitude": 29.944
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 4.7,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.7
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.8
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.9
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 3.6
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 3.7
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 3.8
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.1
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-23-1",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة في برج حديث للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-24-2",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة في برج حديث للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-25-3",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة في برج حديث للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-26-4",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة في برج حديث للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-27-5",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة في برج حديث للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-28-6",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة في برج حديث للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-29-7",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة في برج حديث للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-30-8",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة في برج حديث للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "خزائن حائط",
      "أمن",
      "مصعد",
      "موقف سيارات",
      "بلكونة واسعة",
      "هاتف أرضي"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 981,
    "favoritesCount": 23,
    "searchAppearances": 1577,
    "createdAt": "2026-05-03T10:00:00.000Z",
    "updatedAt": "2026-07-22T12:00:00.000Z"
  },
  {
    "id": "prop-1023",
    "referenceNumber": "EH-1023",
    "slug": "apartment-for-sale-rehab-1023",
    "title": "شقة بتشطيب سوبر لوكس في الرحاب",
    "description": "وحدة شقة بتشطيب سوبر لوكس بمساحة 220 م² في الرحاب، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 6850000,
    "pricePerSqm": 31136,
    "currency": "EGP",
    "area": 220,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 3,
    "finishingType": "super_lux",
    "paymentType": "installment",
    "downPayment": 1027500,
    "installmentYears": 9,
    "monthlyInstallment": 53912,
    "deliveryYear": 2026,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "rehab",
      "areaName": "الرحاب",
      "latitude": 30.058,
      "longitude": 31.492
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 4.8,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.8
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.9
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.6
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 3.7
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 3.8
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.1
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.2
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-24-1",
        "url": "/assets/properties/property-01.webp",
        "alt": "شقة بتشطيب سوبر لوكس",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-25-2",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-26-3",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-27-4",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-28-5",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-29-6",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-30-7",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-31-8",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-32-9",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة بتشطيب سوبر لوكس - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "شرفة",
      "حديقة خاصة",
      "أمن",
      "مصعد",
      "هاتف أرضي",
      "جراج مغطى",
      "عداد مياه"
    ],
    "features": [
      "سوبر لوكس"
    ],
    "verificationState": "verified",
    "views": 1022,
    "favoritesCount": 26,
    "searchAppearances": 1614,
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-07-23T12:00:00.000Z"
  },
  {
    "id": "prop-1024",
    "referenceNumber": "EH-1024",
    "slug": "apartment-for-sale-heliopolis-1024",
    "title": "شقة قريبة من المدارس للبيع في مصر الجديدة",
    "description": "وحدة شقة قريبة من المدارس للبيع بمساحة 237 م² في مصر الجديدة، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 7125000,
    "pricePerSqm": 30063,
    "currency": "EGP",
    "area": 237,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 4,
    "finishingType": "semi_finished",
    "paymentType": "cash_or_installment",
    "downPayment": 1425000,
    "installmentYears": 10,
    "monthlyInstallment": 47500,
    "deliveryYear": 2027,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "heliopolis",
      "cityName": "مصر الجديدة",
      "areaSlug": "heliopolis",
      "areaName": "مصر الجديدة",
      "latitude": 30.091,
      "longitude": 31.322
    },
    "images": [
      {
        "id": "img-25-1",
        "url": "/assets/properties/property-02.webp",
        "alt": "شقة قريبة من المدارس للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-26-2",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-27-3",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-28-4",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-29-5",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-30-6",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-31-7",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-32-8",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-33-9",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-34-10",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة قريبة من المدارس للبيع - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "خزائن حائط",
      "حديقة خاصة",
      "جيم",
      "حمام سباحة",
      "غاز طبيعي",
      "شرفة"
    ],
    "features": [
      "قريبة من المدارس"
    ],
    "verificationState": "verified",
    "views": 1063,
    "favoritesCount": 29,
    "searchAppearances": 1651,
    "createdAt": "2026-07-05T10:00:00.000Z",
    "updatedAt": "2026-07-24T12:00:00.000Z"
  },
  {
    "id": "prop-1025",
    "referenceNumber": "EH-1025",
    "slug": "apartment-for-sale-fifth-settlement-1025",
    "title": "شقة في قلب التجمع للبيع في التجمع الخامس",
    "description": "وحدة شقة في قلب التجمع للبيع بمساحة 95 م² في التجمع الخامس، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 7040000,
    "pricePerSqm": 74105,
    "currency": "EGP",
    "area": 95,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 5,
    "finishingType": "finished",
    "paymentType": "cash",
    "deliveryYear": 2024,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "images": [
      {
        "id": "img-26-1",
        "url": "/assets/properties/property-03.webp",
        "alt": "شقة في قلب التجمع للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-27-2",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة في قلب التجمع للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-28-3",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة في قلب التجمع للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-29-4",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة في قلب التجمع للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-30-5",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة في قلب التجمع للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-31-6",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة في قلب التجمع للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "أمن",
      "غاز طبيعي",
      "عداد مياه",
      "هاتف أرضي",
      "شرفة",
      "حمام سباحة",
      "حديقة خاصة",
      "خزائن حائط",
      "جيم"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 1104,
    "favoritesCount": 32,
    "searchAppearances": 1688,
    "createdAt": "2026-08-06T10:00:00.000Z",
    "updatedAt": "2026-07-25T12:00:00.000Z"
  },
  {
    "id": "prop-1026",
    "referenceNumber": "EH-1026",
    "slug": "apartment-for-sale-madinaty-1026",
    "title": "شقة بواجهة زجاجية للبيع في مدينتي",
    "description": "وحدة شقة بواجهة زجاجية للبيع بمساحة 112 م² في مدينتي، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 7315000,
    "pricePerSqm": 65313,
    "currency": "EGP",
    "area": 112,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 6,
    "finishingType": "lux",
    "paymentType": "installment",
    "downPayment": 731500,
    "installmentYears": 6,
    "monthlyInstallment": 91438,
    "deliveryYear": 2025,
    "viewType": "شارع رئيسي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "madinaty",
      "areaName": "مدينتي",
      "latitude": 30.1001,
      "longitude": 31.637
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 3.7,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.7
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.8
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.1
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.2
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.3
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.4
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.6
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-27-1",
        "url": "/assets/properties/property-04.webp",
        "alt": "شقة بواجهة زجاجية للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-28-2",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-29-3",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-30-4",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-31-5",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-32-6",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-33-7",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة بواجهة زجاجية للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "مصعد",
      "جراج مغطى",
      "نظام إنذار",
      "جيم",
      "تدفئة مركزية",
      "تكييف مركزي",
      "غاز طبيعي",
      "عداد مياه"
    ],
    "features": [
      "واجهة زجاجية"
    ],
    "verificationState": "pending",
    "views": 1145,
    "favoritesCount": 35,
    "searchAppearances": 1725,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-07-01T12:00:00.000Z"
  },
  {
    "id": "prop-1027",
    "referenceNumber": "EH-1027",
    "slug": "apartment-for-sale-sheikh-zayed-1027",
    "title": "شقة بحديقة خلفية للبيع في الشيخ زايد",
    "description": "وحدة شقة بحديقة خلفية للبيع بمساحة 129 م² في الشيخ زايد، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 7590000,
    "pricePerSqm": 58837,
    "currency": "EGP",
    "area": 129,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 7,
    "finishingType": "super_lux",
    "paymentType": "cash_or_installment",
    "downPayment": 1138500,
    "installmentYears": 7,
    "monthlyInstallment": 76804,
    "deliveryYear": 2026,
    "viewType": "مفتوح",
    "gardenArea": 50,
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "sheikh-zayed",
      "cityName": "الشيخ زايد",
      "areaSlug": "sheikh-zayed",
      "areaName": "الشيخ زايد",
      "latitude": 30.0264,
      "longitude": 30.9695
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 3.8,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.8
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.1
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.2
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.3
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.4
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.6
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.7
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-28-1",
        "url": "/assets/properties/property-05.webp",
        "alt": "شقة بحديقة خلفية للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-29-2",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-30-3",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-31-4",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-32-5",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-33-6",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-34-7",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-35-8",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة بحديقة خلفية للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "موقف سيارات",
      "مصعد",
      "تدفئة مركزية",
      "نظام إنذار",
      "تكييف مركزي",
      "أمن",
      "جيم",
      "عداد مياه",
      "هاتف أرضي",
      "جراج مغطى",
      "غاز طبيعي"
    ],
    "features": [
      "شقة بحديقة"
    ],
    "verificationState": "verified",
    "views": 1186,
    "favoritesCount": 38,
    "searchAppearances": 1762,
    "createdAt": "2026-05-08T10:00:00.000Z",
    "updatedAt": "2026-07-02T12:00:00.000Z"
  },
  {
    "id": "prop-1028",
    "referenceNumber": "EH-1028",
    "slug": "apartment-for-sale-nasr-city-1028",
    "title": "شقة عصرية بمساحة مرنة للبيع في مدينة نصر",
    "description": "وحدة شقة عصرية بمساحة مرنة للبيع بمساحة 131 م² في مدينة نصر، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "apartment",
    "price": 7865000,
    "pricePerSqm": 60038,
    "currency": "EGP",
    "area": 131,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 8,
    "finishingType": "semi_finished",
    "paymentType": "cash",
    "deliveryYear": 2027,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "nasr-city",
      "cityName": "مدينة نصر",
      "areaSlug": "nasr-city",
      "areaName": "مدينة نصر",
      "latitude": 30.0626,
      "longitude": 31.3497
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 4,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.1
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.2
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.3
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.4
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.6
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.7
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.8
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-29-1",
        "url": "/assets/properties/property-06.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-30-2",
        "url": "/assets/properties/property-07.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-31-3",
        "url": "/assets/properties/property-08.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-32-4",
        "url": "/assets/properties/property-09.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-33-5",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-34-6",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-35-7",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-36-8",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-37-9",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة عصرية بمساحة مرنة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "مصعد",
      "تكييف مركزي",
      "بلكونة واسعة",
      "موقف سيارات",
      "أمن",
      "عداد مياه",
      "هاتف أرضي",
      "جراج مغطى",
      "شرفة",
      "غاز طبيعي",
      "تدفئة مركزية",
      "نظام إنذار"
    ],
    "features": [
      "سكني"
    ],
    "verificationState": "verified",
    "views": 1227,
    "favoritesCount": 41,
    "searchAppearances": 1799,
    "createdAt": "2026-06-09T10:00:00.000Z",
    "updatedAt": "2026-07-03T12:00:00.000Z"
  },
  {
    "id": "prop-1029",
    "referenceNumber": "EH-1029",
    "slug": "villa-for-sale-6th-october-1029",
    "title": "فيلا مستقلة للبيع في ٦ أكتوبر",
    "description": "وحدة فيلا مستقلة للبيع بمساحة 380 م² في ٦ أكتوبر، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 5 غرف و4 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "villa",
    "price": 15500000,
    "pricePerSqm": 40789,
    "currency": "EGP",
    "area": 380,
    "bedrooms": 5,
    "bathrooms": 4,
    "floor": 9,
    "finishingType": "finished",
    "paymentType": "installment",
    "downPayment": 775000,
    "installmentYears": 9,
    "monthlyInstallment": 136343,
    "deliveryYear": 2024,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "6th-october",
      "cityName": "٦ أكتوبر",
      "areaSlug": "6th-october",
      "areaName": "٦ أكتوبر",
      "latitude": 29.9381,
      "longitude": 30.9138
    },
    "images": [
      {
        "id": "img-30-1",
        "url": "/assets/properties/property-07.webp",
        "alt": "فيلا مستقلة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-31-2",
        "url": "/assets/properties/property-08.webp",
        "alt": "فيلا مستقلة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-32-3",
        "url": "/assets/properties/property-09.webp",
        "alt": "فيلا مستقلة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-33-4",
        "url": "/assets/properties/property-10.webp",
        "alt": "فيلا مستقلة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-34-5",
        "url": "/assets/properties/property-11.webp",
        "alt": "فيلا مستقلة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-35-6",
        "url": "/assets/properties/property-12.webp",
        "alt": "فيلا مستقلة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-36-7",
        "url": "/assets/properties/property-13.webp",
        "alt": "فيلا مستقلة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-37-8",
        "url": "/assets/properties/property-14.webp",
        "alt": "فيلا مستقلة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-38-9",
        "url": "/assets/properties/property-15.webp",
        "alt": "فيلا مستقلة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-39-10",
        "url": "/assets/properties/property-16.webp",
        "alt": "فيلا مستقلة للبيع - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "خزائن حائط",
      "بلكونة واسعة",
      "مصعد",
      "جراج مغطى"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 1268,
    "favoritesCount": 44,
    "searchAppearances": 1836,
    "createdAt": "2026-07-10T10:00:00.000Z",
    "updatedAt": "2026-07-04T12:00:00.000Z"
  },
  {
    "id": "prop-1030",
    "referenceNumber": "EH-1030",
    "slug": "duplex-for-sale-smouha-1030",
    "title": "دوبلكس للبيع في سموحة",
    "description": "وحدة دوبلكس للبيع بمساحة 280 م² في سموحة، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "duplex",
    "price": 9800000,
    "pricePerSqm": 35000,
    "currency": "EGP",
    "area": 280,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 10,
    "finishingType": "lux",
    "paymentType": "cash_or_installment",
    "downPayment": 980000,
    "installmentYears": 10,
    "monthlyInstallment": 73500,
    "deliveryYear": 2025,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "alexandria",
      "governorateName": "الإسكندرية",
      "citySlug": "alexandria",
      "cityName": "الإسكندرية",
      "areaSlug": "smouha",
      "areaName": "سموحة",
      "latitude": 31.2165,
      "longitude": 29.944
    },
    "images": [
      {
        "id": "img-31-1",
        "url": "/assets/properties/property-08.webp",
        "alt": "دوبلكس للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-32-2",
        "url": "/assets/properties/property-09.webp",
        "alt": "دوبلكس للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-33-3",
        "url": "/assets/properties/property-10.webp",
        "alt": "دوبلكس للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-34-4",
        "url": "/assets/properties/property-11.webp",
        "alt": "دوبلكس للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-35-5",
        "url": "/assets/properties/property-12.webp",
        "alt": "دوبلكس للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-36-6",
        "url": "/assets/properties/property-13.webp",
        "alt": "دوبلكس للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "أمن",
      "حمام سباحة",
      "حديقة خاصة",
      "خزائن حائط",
      "شرفة",
      "هاتف أرضي",
      "بلكونة واسعة"
    ],
    "features": [
      "دوبلكس"
    ],
    "verificationState": "verified",
    "views": 1309,
    "favoritesCount": 47,
    "searchAppearances": 1873,
    "createdAt": "2026-08-11T10:00:00.000Z",
    "updatedAt": "2026-07-05T12:00:00.000Z"
  },
  {
    "id": "prop-1031",
    "referenceNumber": "EH-1031",
    "slug": "penthouse-for-sale-rehab-1031",
    "title": "بنتهاوس للبيع في الرحاب",
    "description": "وحدة بنتهاوس للبيع بمساحة 240 م² في الرحاب، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 3 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "penthouse",
    "price": 11200000,
    "pricePerSqm": 46667,
    "currency": "EGP",
    "area": 240,
    "bedrooms": 3,
    "bathrooms": 3,
    "floor": 1,
    "finishingType": "super_lux",
    "paymentType": "cash",
    "deliveryYear": 2026,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "rehab",
      "areaName": "الرحاب",
      "latitude": 30.058,
      "longitude": 31.492
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4.3,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.3
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.4
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.6
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.7
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.8
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.9
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.6
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.7
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-32-1",
        "url": "/assets/properties/property-09.webp",
        "alt": "بنتهاوس للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-33-2",
        "url": "/assets/properties/property-10.webp",
        "alt": "بنتهاوس للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-34-3",
        "url": "/assets/properties/property-11.webp",
        "alt": "بنتهاوس للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-35-4",
        "url": "/assets/properties/property-12.webp",
        "alt": "بنتهاوس للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-36-5",
        "url": "/assets/properties/property-13.webp",
        "alt": "بنتهاوس للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-37-6",
        "url": "/assets/properties/property-14.webp",
        "alt": "بنتهاوس للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-38-7",
        "url": "/assets/properties/property-15.webp",
        "alt": "بنتهاوس للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "مصعد",
      "جراج مغطى",
      "جيم",
      "حمام سباحة",
      "حديقة خاصة",
      "خزائن حائط"
    ],
    "features": [
      "بنتهاوس",
      "روف"
    ],
    "verificationState": "pending",
    "views": 1350,
    "favoritesCount": 5,
    "searchAppearances": 1910,
    "createdAt": "2026-04-12T10:00:00.000Z",
    "updatedAt": "2026-07-06T12:00:00.000Z"
  },
  {
    "id": "prop-1032",
    "referenceNumber": "EH-1032",
    "slug": "apartment-for-rent-heliopolis-1032",
    "title": "شقة للإيجار في مصر الجديدة",
    "description": "وحدة شقة للإيجار بمساحة 120 م² في مصر الجديدة، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 2 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "rent",
    "propertyType": "apartment",
    "price": 18000,
    "pricePerSqm": 150,
    "currency": "EGP",
    "area": 120,
    "bedrooms": 2,
    "bathrooms": 2,
    "floor": 2,
    "finishingType": "semi_finished",
    "paymentType": "cash",
    "deliveryYear": 2027,
    "viewType": "شارع رئيسي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "heliopolis",
      "cityName": "مصر الجديدة",
      "areaSlug": "heliopolis",
      "areaName": "مصر الجديدة",
      "latitude": 30.091,
      "longitude": 31.322
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 4.4,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.4
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.6
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.7
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.8
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.9
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 3.6
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.7
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 3.8
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-33-1",
        "url": "/assets/properties/property-10.webp",
        "alt": "شقة للإيجار",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-34-2",
        "url": "/assets/properties/property-11.webp",
        "alt": "شقة للإيجار - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-35-3",
        "url": "/assets/properties/property-12.webp",
        "alt": "شقة للإيجار - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-36-4",
        "url": "/assets/properties/property-13.webp",
        "alt": "شقة للإيجار - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-37-5",
        "url": "/assets/properties/property-14.webp",
        "alt": "شقة للإيجار - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-38-6",
        "url": "/assets/properties/property-15.webp",
        "alt": "شقة للإيجار - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-39-7",
        "url": "/assets/properties/property-16.webp",
        "alt": "شقة للإيجار - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-40-8",
        "url": "/assets/properties/property-17.webp",
        "alt": "شقة للإيجار - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "عداد مياه",
      "جراج مغطى",
      "غاز طبيعي",
      "حديقة خاصة",
      "هاتف أرضي",
      "أمن",
      "مصعد",
      "خزائن حائط",
      "شرفة"
    ],
    "features": [
      "مفروش"
    ],
    "verificationState": "verified",
    "views": 1391,
    "favoritesCount": 8,
    "searchAppearances": 1947,
    "createdAt": "2026-05-13T10:00:00.000Z",
    "updatedAt": "2026-07-07T12:00:00.000Z"
  },
  {
    "id": "prop-1033",
    "referenceNumber": "EH-1033",
    "slug": "studio-for-rent-fifth-settlement-1033",
    "title": "استوديو للإيجار في التجمع الخامس",
    "description": "وحدة استوديو للإيجار بمساحة 48 م² في التجمع الخامس، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 0 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "rent",
    "propertyType": "studio",
    "price": 9000,
    "pricePerSqm": 188,
    "currency": "EGP",
    "area": 48,
    "bedrooms": 0,
    "bathrooms": 1,
    "finishingType": "finished",
    "paymentType": "cash",
    "deliveryYear": 2024,
    "viewType": "مفتوح",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "fifth-settlement",
      "areaName": "التجمع الخامس",
      "latitude": 30.0148,
      "longitude": 31.4281
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 4.6,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.6
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 4.7
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4.8
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.9
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 3.6
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 3.7
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 3.8
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-34-1",
        "url": "/assets/properties/property-11.webp",
        "alt": "استوديو للإيجار",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-35-2",
        "url": "/assets/properties/property-12.webp",
        "alt": "استوديو للإيجار - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-36-3",
        "url": "/assets/properties/property-13.webp",
        "alt": "استوديو للإيجار - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-37-4",
        "url": "/assets/properties/property-14.webp",
        "alt": "استوديو للإيجار - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-38-5",
        "url": "/assets/properties/property-15.webp",
        "alt": "استوديو للإيجار - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-39-6",
        "url": "/assets/properties/property-16.webp",
        "alt": "استوديو للإيجار - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-40-7",
        "url": "/assets/properties/property-17.webp",
        "alt": "استوديو للإيجار - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-41-8",
        "url": "/assets/properties/property-18.webp",
        "alt": "استوديو للإيجار - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-42-9",
        "url": "/assets/properties/property-19.webp",
        "alt": "استوديو للإيجار - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "عداد مياه",
      "تكييف مركزي",
      "تدفئة مركزية",
      "جيم",
      "نظام إنذار",
      "جراج مغطى",
      "غاز طبيعي",
      "حمام سباحة",
      "هاتف أرضي",
      "أمن"
    ],
    "features": [
      "ستوديو",
      "مفروش"
    ],
    "verificationState": "verified",
    "views": 1432,
    "favoritesCount": 11,
    "searchAppearances": 1984,
    "createdAt": "2026-06-14T10:00:00.000Z",
    "updatedAt": "2026-07-08T12:00:00.000Z"
  },
  {
    "id": "prop-1034",
    "referenceNumber": "EH-1034",
    "slug": "office-for-rent-madinaty-1034",
    "title": "مكتب إداري للإيجار في مدينتي",
    "description": "وحدة مكتب إداري للإيجار بمساحة 170 م² في مدينتي، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 0 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "rent",
    "propertyType": "office",
    "price": 40000,
    "pricePerSqm": 235,
    "currency": "EGP",
    "area": 170,
    "bedrooms": 0,
    "bathrooms": 2,
    "finishingType": "lux",
    "paymentType": "cash",
    "deliveryYear": 2025,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "madinaty",
      "areaName": "مدينتي",
      "latitude": 30.1001,
      "longitude": 31.637
    },
    "images": [
      {
        "id": "img-35-1",
        "url": "/assets/properties/property-12.webp",
        "alt": "مكتب إداري للإيجار",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-36-2",
        "url": "/assets/properties/property-13.webp",
        "alt": "مكتب إداري للإيجار - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-37-3",
        "url": "/assets/properties/property-14.webp",
        "alt": "مكتب إداري للإيجار - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-38-4",
        "url": "/assets/properties/property-15.webp",
        "alt": "مكتب إداري للإيجار - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-39-5",
        "url": "/assets/properties/property-16.webp",
        "alt": "مكتب إداري للإيجار - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-40-6",
        "url": "/assets/properties/property-17.webp",
        "alt": "مكتب إداري للإيجار - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-41-7",
        "url": "/assets/properties/property-18.webp",
        "alt": "مكتب إداري للإيجار - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-42-8",
        "url": "/assets/properties/property-19.webp",
        "alt": "مكتب إداري للإيجار - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-43-9",
        "url": "/assets/properties/property-20.webp",
        "alt": "مكتب إداري للإيجار - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-44-10",
        "url": "/assets/properties/property-21.webp",
        "alt": "مكتب إداري للإيجار - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "هاتف أرضي",
      "موقف سيارات",
      "عداد مياه",
      "تكييف مركزي",
      "تدفئة مركزية",
      "نظام إنذار",
      "مصعد",
      "جراج مغطى",
      "أمن",
      "شرفة",
      "غاز طبيعي"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 1473,
    "favoritesCount": 14,
    "searchAppearances": 2021,
    "createdAt": "2026-07-15T10:00:00.000Z",
    "updatedAt": "2026-07-09T12:00:00.000Z"
  },
  {
    "id": "prop-1035",
    "referenceNumber": "EH-1035",
    "slug": "chalet-for-sale-sheikh-zayed-1035",
    "title": "شاليه للبيع في الشيخ زايد",
    "description": "وحدة شاليه للبيع بمساحة 140 م² في الشيخ زايد، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 3 غرف و2 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "chalet",
    "price": 7200000,
    "pricePerSqm": 51429,
    "currency": "EGP",
    "area": 140,
    "bedrooms": 3,
    "bathrooms": 2,
    "floor": 5,
    "finishingType": "super_lux",
    "paymentType": "installment",
    "downPayment": 1080000,
    "installmentYears": 9,
    "monthlyInstallment": 56667,
    "deliveryYear": 2026,
    "viewType": "حمام سباحة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "sheikh-zayed",
      "cityName": "الشيخ زايد",
      "areaSlug": "sheikh-zayed",
      "areaName": "الشيخ زايد",
      "latitude": 30.0264,
      "longitude": 30.9695
    },
    "images": [
      {
        "id": "img-36-1",
        "url": "/assets/properties/property-13.webp",
        "alt": "شاليه للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-37-2",
        "url": "/assets/properties/property-14.webp",
        "alt": "شاليه للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-38-3",
        "url": "/assets/properties/property-15.webp",
        "alt": "شاليه للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-39-4",
        "url": "/assets/properties/property-16.webp",
        "alt": "شاليه للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-40-5",
        "url": "/assets/properties/property-17.webp",
        "alt": "شاليه للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-41-6",
        "url": "/assets/properties/property-18.webp",
        "alt": "شاليه للبيع - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "أمن",
      "بلكونة واسعة",
      "هاتف أرضي",
      "نظام إنذار",
      "موقف سيارات",
      "تكييف مركزي",
      "تدفئة مركزية",
      "مصعد",
      "جراج مغطى",
      "شرفة",
      "عداد مياه",
      "غاز طبيعي"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 1514,
    "favoritesCount": 17,
    "searchAppearances": 2058,
    "createdAt": "2026-08-16T10:00:00.000Z",
    "updatedAt": "2026-07-10T12:00:00.000Z"
  },
  {
    "id": "prop-1036",
    "referenceNumber": "EH-1036",
    "slug": "townhouse-for-sale-nasr-city-1036",
    "title": "تاون هاوس للبيع في مدينة نصر",
    "description": "وحدة تاون هاوس للبيع بمساحة 250 م² في مدينة نصر، الوحدة تقع داخل كمبوند أوركيد بارك مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "townhouse",
    "price": 8900000,
    "pricePerSqm": 35600,
    "currency": "EGP",
    "area": 250,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 6,
    "finishingType": "semi_finished",
    "paymentType": "cash_or_installment",
    "downPayment": 1780000,
    "installmentYears": 10,
    "monthlyInstallment": 59333,
    "deliveryYear": 2027,
    "viewType": "نادي",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "nasr-city",
      "cityName": "مدينة نصر",
      "areaSlug": "nasr-city",
      "areaName": "مدينة نصر",
      "latitude": 30.0626,
      "longitude": 31.3497
    },
    "compoundId": "cmp-orchid-park",
    "compoundSlug": "orchid-park",
    "compoundName": "أوركيد بارك",
    "compoundDescription": "كمبوند سكني هادئ بخدمات يومية قريبة ومساحات خضراء مناسبة للعائلات.",
    "compoundRatings": {
      "overall": 4.9,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 4.9
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.6
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.7
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 3.8
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.1
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.2
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.3
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-37-1",
        "url": "/assets/properties/property-14.webp",
        "alt": "تاون هاوس للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-38-2",
        "url": "/assets/properties/property-15.webp",
        "alt": "تاون هاوس للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-39-3",
        "url": "/assets/properties/property-16.webp",
        "alt": "تاون هاوس للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-40-4",
        "url": "/assets/properties/property-17.webp",
        "alt": "تاون هاوس للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-41-5",
        "url": "/assets/properties/property-18.webp",
        "alt": "تاون هاوس للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-42-6",
        "url": "/assets/properties/property-19.webp",
        "alt": "تاون هاوس للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-43-7",
        "url": "/assets/properties/property-20.webp",
        "alt": "تاون هاوس للبيع - صورة 7",
        "isCover": false,
        "order": 7
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "أمن",
      "هاتف أرضي",
      "مصعد",
      "جراج مغطى",
      "موقف سيارات",
      "خزائن حائط"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "pending",
    "views": 1555,
    "favoritesCount": 20,
    "searchAppearances": 2095,
    "createdAt": "2026-04-17T10:00:00.000Z",
    "updatedAt": "2026-07-11T12:00:00.000Z"
  },
  {
    "id": "prop-1037",
    "referenceNumber": "EH-1037",
    "slug": "land-for-sale-6th-october-1037",
    "title": "قطعة أرض للبيع في ٦ أكتوبر",
    "description": "وحدة قطعة أرض للبيع بمساحة 600 م² في ٦ أكتوبر، الوحدة تقع داخل كمبوند بالم فالي مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 0 غرف و0 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "land",
    "price": 9800000,
    "pricePerSqm": 16333,
    "currency": "EGP",
    "area": 600,
    "bedrooms": 0,
    "bathrooms": 0,
    "finishingType": "finished",
    "paymentType": "cash",
    "deliveryYear": 2024,
    "viewType": "حديقة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "giza",
      "governorateName": "الجيزة",
      "citySlug": "6th-october",
      "cityName": "٦ أكتوبر",
      "areaSlug": "6th-october",
      "areaName": "٦ أكتوبر",
      "latitude": 29.9381,
      "longitude": 30.9138
    },
    "compoundId": "cmp-palm-valley",
    "compoundSlug": "palm-valley",
    "compoundName": "بالم فالي",
    "compoundDescription": "مشروع متكامل بواجهات حديثة وخيارات وحدات متنوعة داخل القاهرة الجديدة.",
    "compoundRatings": {
      "overall": 3.6,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.6
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.7
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 3.8
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.1
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.2
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.3
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.4
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-38-1",
        "url": "/assets/properties/property-15.webp",
        "alt": "قطعة أرض للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-39-2",
        "url": "/assets/properties/property-16.webp",
        "alt": "قطعة أرض للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-40-3",
        "url": "/assets/properties/property-17.webp",
        "alt": "قطعة أرض للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-41-4",
        "url": "/assets/properties/property-18.webp",
        "alt": "قطعة أرض للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-42-5",
        "url": "/assets/properties/property-19.webp",
        "alt": "قطعة أرض للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-43-6",
        "url": "/assets/properties/property-20.webp",
        "alt": "قطعة أرض للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-44-7",
        "url": "/assets/properties/property-21.webp",
        "alt": "قطعة أرض للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-45-8",
        "url": "/assets/properties/property-22.webp",
        "alt": "قطعة أرض للبيع - صورة 8",
        "isCover": false,
        "order": 8
      }
    ],
    "seller": {
      "id": "seller-01",
      "name": "مكتب النور العقاري",
      "type": "agency",
      "phone": "+201000000101",
      "whatsapp": "+201000000101",
      "isVerified": true,
      "rating": 4.2,
      "listingCount": 128
    },
    "amenities": [
      "خزائن حائط",
      "حديقة خاصة",
      "حمام سباحة",
      "شرفة",
      "أمن",
      "هاتف أرضي",
      "مصعد"
    ],
    "features": [
      "قريبة من الخدمات"
    ],
    "verificationState": "verified",
    "views": 1596,
    "favoritesCount": 23,
    "searchAppearances": 2132,
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-07-12T12:00:00.000Z"
  },
  {
    "id": "prop-1038",
    "referenceNumber": "EH-1038",
    "slug": "duplex-for-sale-smouha-1038",
    "title": "دوبلكس بحديقة للبيع في سموحة",
    "description": "وحدة دوبلكس بحديقة للبيع بمساحة 300 م² في سموحة، الوحدة تقع داخل كمبوند إيستوود ريزيدنس مع إطلالة مناسبة وخدمات مشتركة. المساحات موزعة بشكل عملي مع 4 غرف و3 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "duplex",
    "price": 11800000,
    "pricePerSqm": 39333,
    "currency": "EGP",
    "area": 300,
    "bedrooms": 4,
    "bathrooms": 3,
    "floor": 8,
    "finishingType": "lux",
    "paymentType": "installment",
    "downPayment": 1180000,
    "installmentYears": 6,
    "monthlyInstallment": 147500,
    "deliveryYear": 2025,
    "viewType": "شارع رئيسي",
    "gardenArea": 60,
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "alexandria",
      "governorateName": "الإسكندرية",
      "citySlug": "alexandria",
      "cityName": "الإسكندرية",
      "areaSlug": "smouha",
      "areaName": "سموحة",
      "latitude": 31.2165,
      "longitude": 29.944
    },
    "compoundId": "cmp-eastwood-residence",
    "compoundSlug": "eastwood-residence",
    "compoundName": "إيستوود ريزيدنس",
    "compoundDescription": "تجمع سكني حديث يركز على الخصوصية والقرب من المحاور الرئيسية.",
    "compoundRatings": {
      "overall": 3.7,
      "categories": [
        {
          "key": "overall",
          "label": "التقييم العام",
          "score": 3.7
        },
        {
          "key": "cleanliness",
          "label": "مستوى النظافة",
          "score": 3.8
        },
        {
          "key": "location",
          "label": "الموقع",
          "score": 4
        },
        {
          "key": "quiet",
          "label": "الهدوء",
          "score": 4.1
        },
        {
          "key": "transport",
          "label": "المواصلات",
          "score": 4.2
        },
        {
          "key": "schools",
          "label": "المدارس والخدمات",
          "score": 4.3
        },
        {
          "key": "shopping",
          "label": "التسوق والمطاعم",
          "score": 4.4
        },
        {
          "key": "health",
          "label": "الخدمات الصحية",
          "score": 4.6
        }
      ]
    },
    "developerId": "dev-nile-horizon",
    "developerName": "نايل هورايزون للتطوير",
    "images": [
      {
        "id": "img-39-1",
        "url": "/assets/properties/property-16.webp",
        "alt": "دوبلكس بحديقة للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-40-2",
        "url": "/assets/properties/property-17.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-41-3",
        "url": "/assets/properties/property-18.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-42-4",
        "url": "/assets/properties/property-19.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-43-5",
        "url": "/assets/properties/property-20.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-44-6",
        "url": "/assets/properties/property-21.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-45-7",
        "url": "/assets/properties/property-22.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-46-8",
        "url": "/assets/properties/property-23.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-47-9",
        "url": "/assets/properties/property-01.webp",
        "alt": "دوبلكس بحديقة للبيع - صورة 9",
        "isCover": false,
        "order": 9
      }
    ],
    "seller": {
      "id": "seller-02",
      "name": "أحمد منصور",
      "type": "broker",
      "phone": "+201000000202",
      "whatsapp": "+201000000202",
      "isVerified": true,
      "rating": 4.6,
      "listingCount": 42
    },
    "amenities": [
      "شرفة",
      "حديقة خاصة",
      "جيم",
      "غاز طبيعي",
      "حمام سباحة",
      "جراج مغطى",
      "خزائن حائط",
      "أمن"
    ],
    "features": [
      "دوبلكس بحديقة",
      "شقة بحديقة"
    ],
    "verificationState": "verified",
    "views": 1637,
    "favoritesCount": 26,
    "searchAppearances": 2169,
    "createdAt": "2026-06-19T10:00:00.000Z",
    "updatedAt": "2026-07-13T12:00:00.000Z"
  },
  {
    "id": "prop-1039",
    "referenceNumber": "EH-1039",
    "slug": "studio-for-sale-rehab-1039",
    "title": "ستوديو فندقي للبيع في الرحاب",
    "description": "وحدة ستوديو فندقي للبيع بمساحة 55 م² في الرحاب، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 0 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "sale",
    "propertyType": "studio",
    "price": 2800000,
    "pricePerSqm": 50909,
    "currency": "EGP",
    "area": 55,
    "bedrooms": 0,
    "bathrooms": 1,
    "finishingType": "super_lux",
    "paymentType": "cash_or_installment",
    "downPayment": 420000,
    "installmentYears": 7,
    "monthlyInstallment": 28333,
    "deliveryYear": 2026,
    "viewType": "مفتوح",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "new-cairo",
      "cityName": "القاهرة الجديدة",
      "areaSlug": "rehab",
      "areaName": "الرحاب",
      "latitude": 30.058,
      "longitude": 31.492
    },
    "images": [
      {
        "id": "img-40-1",
        "url": "/assets/properties/property-17.webp",
        "alt": "ستوديو فندقي للبيع",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-41-2",
        "url": "/assets/properties/property-18.webp",
        "alt": "ستوديو فندقي للبيع - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-42-3",
        "url": "/assets/properties/property-19.webp",
        "alt": "ستوديو فندقي للبيع - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-43-4",
        "url": "/assets/properties/property-20.webp",
        "alt": "ستوديو فندقي للبيع - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-44-5",
        "url": "/assets/properties/property-21.webp",
        "alt": "ستوديو فندقي للبيع - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-45-6",
        "url": "/assets/properties/property-22.webp",
        "alt": "ستوديو فندقي للبيع - صورة 6",
        "isCover": false,
        "order": 6
      },
      {
        "id": "img-46-7",
        "url": "/assets/properties/property-23.webp",
        "alt": "ستوديو فندقي للبيع - صورة 7",
        "isCover": false,
        "order": 7
      },
      {
        "id": "img-47-8",
        "url": "/assets/properties/property-01.webp",
        "alt": "ستوديو فندقي للبيع - صورة 8",
        "isCover": false,
        "order": 8
      },
      {
        "id": "img-48-9",
        "url": "/assets/properties/property-02.webp",
        "alt": "ستوديو فندقي للبيع - صورة 9",
        "isCover": false,
        "order": 9
      },
      {
        "id": "img-49-10",
        "url": "/assets/properties/property-03.webp",
        "alt": "ستوديو فندقي للبيع - صورة 10",
        "isCover": false,
        "order": 10
      }
    ],
    "seller": {
      "id": "seller-03",
      "name": "سارة فؤاد",
      "type": "owner",
      "phone": "+201000000303",
      "whatsapp": "+201000000303",
      "isVerified": false,
      "rating": 4,
      "listingCount": 3
    },
    "amenities": [
      "هاتف أرضي",
      "عداد مياه",
      "شرفة",
      "حديقة خاصة",
      "جيم",
      "غاز طبيعي",
      "حمام سباحة",
      "جراج مغطى",
      "أمن"
    ],
    "features": [
      "ستوديو فندقي",
      "مفروش"
    ],
    "verificationState": "verified",
    "views": 1678,
    "favoritesCount": 29,
    "searchAppearances": 2206,
    "createdAt": "2026-07-20T10:00:00.000Z",
    "updatedAt": "2026-07-14T12:00:00.000Z"
  },
  {
    "id": "prop-1040",
    "referenceNumber": "EH-1040",
    "slug": "apartment-for-rent-heliopolis-1040",
    "title": "شقة مفروشة للإيجار في مصر الجديدة",
    "description": "وحدة شقة مفروشة للإيجار بمساحة 100 م² في مصر الجديدة، الوحدة في موقع سكني منظم وقريب من الخدمات اليومية. المساحات موزعة بشكل عملي مع 2 غرف و1 حمام، وواجهة مناسبة للاستخدام اليومي. المنطقة توفر وصولًا جيدًا للطرق الرئيسية والخدمات التجارية والتعليمية. الوصف مخصص للعرض التجريبي ويعكس تفاصيل الوحدة دون الاعتماد على نصوص خارجية.",
    "transactionType": "rent",
    "propertyType": "apartment",
    "price": 15000,
    "pricePerSqm": 150,
    "currency": "EGP",
    "area": 100,
    "bedrooms": 2,
    "bathrooms": 1,
    "floor": 10,
    "finishingType": "semi_finished",
    "paymentType": "cash",
    "deliveryYear": 2027,
    "viewType": "بحيرة",
    "location": {
      "countrySlug": "egypt",
      "countryName": "مصر",
      "governorateSlug": "cairo",
      "governorateName": "القاهرة",
      "citySlug": "heliopolis",
      "cityName": "مصر الجديدة",
      "areaSlug": "heliopolis",
      "areaName": "مصر الجديدة",
      "latitude": 30.091,
      "longitude": 31.322
    },
    "images": [
      {
        "id": "img-41-1",
        "url": "/assets/properties/property-18.webp",
        "alt": "شقة مفروشة للإيجار",
        "isCover": true,
        "order": 1
      },
      {
        "id": "img-42-2",
        "url": "/assets/properties/property-19.webp",
        "alt": "شقة مفروشة للإيجار - صورة 2",
        "isCover": false,
        "order": 2
      },
      {
        "id": "img-43-3",
        "url": "/assets/properties/property-20.webp",
        "alt": "شقة مفروشة للإيجار - صورة 3",
        "isCover": false,
        "order": 3
      },
      {
        "id": "img-44-4",
        "url": "/assets/properties/property-21.webp",
        "alt": "شقة مفروشة للإيجار - صورة 4",
        "isCover": false,
        "order": 4
      },
      {
        "id": "img-45-5",
        "url": "/assets/properties/property-22.webp",
        "alt": "شقة مفروشة للإيجار - صورة 5",
        "isCover": false,
        "order": 5
      },
      {
        "id": "img-46-6",
        "url": "/assets/properties/property-23.webp",
        "alt": "شقة مفروشة للإيجار - صورة 6",
        "isCover": false,
        "order": 6
      }
    ],
    "seller": {
      "id": "seller-04",
      "name": "شركة سكن بلس",
      "type": "agency",
      "phone": "+201000000404",
      "whatsapp": "+201000000404",
      "isVerified": true,
      "rating": 3.9,
      "listingCount": 214
    },
    "amenities": [
      "أمن",
      "نظام إنذار",
      "تكييف مركزي",
      "هاتف أرضي",
      "عداد مياه",
      "شرفة",
      "غاز طبيعي",
      "حمام سباحة",
      "حديقة خاصة",
      "تدفئة مركزية"
    ],
    "features": [
      "مفروش"
    ],
    "verificationState": "verified",
    "views": 1719,
    "favoritesCount": 32,
    "searchAppearances": 2243,
    "createdAt": "2026-08-21T10:00:00.000Z",
    "updatedAt": "2026-07-15T12:00:00.000Z"
  }
];

function agentSeller(
  id: string,
  name: string,
  type: PropertySeller['type'],
  phone: string,
): PropertySeller {
  return {
    id,
    name,
    type,
    phone,
    whatsapp: phone,
    isVerified: true,
  };
}

const agentSellers: Record<string, PropertySeller> = {
  'seller-prime-gate': agentSeller(
    'seller-prime-gate',
    'Prime Gate Realty',
    'agency',
    '+201000001101',
  ),
  'seller-nile-keys': agentSeller(
    'seller-nile-keys',
    'Nile Keys Properties',
    'agency',
    '+201000001102',
  ),
  'seller-urban-point': agentSeller(
    'seller-urban-point',
    'Urban Point Realty',
    'agency',
    '+201000001103',
  ),
  'seller-bayt-asima': agentSeller(
    'seller-bayt-asima',
    'بيت العاصمة العقارية',
    'agency',
    '+201000001104',
  ),
  'seller-miftah': agentSeller(
    'seller-miftah',
    'مفتاح القاهرة',
    'agency',
    '+201000001105',
  ),
  'seller-delta-view': agentSeller(
    'seller-delta-view',
    'Delta View Estates',
    'agency',
    '+201000001106',
  ),
  'seller-harbor-line': agentSeller(
    'seller-harbor-line',
    'Harbor Line Realty',
    'agency',
    '+201000001107',
  ),
  'seller-huda-mansour': agentSeller(
    'seller-huda-mansour',
    'هدى منصور',
    'broker',
    '+201000001201',
  ),
  'seller-karim-shafie': agentSeller(
    'seller-karim-shafie',
    'كريم الشافعي',
    'broker',
    '+201000001202',
  ),
  'seller-nora': agentSeller(
    'seller-nora',
    'نورا عبد الفتاح',
    'broker',
    '+201000001203',
  ),
};

const sellerAssignment: Array<{ sellerId: string; count: number }> = [
  { sellerId: 'seller-prime-gate', count: 15 },
  { sellerId: 'seller-nile-keys', count: 3 },
  { sellerId: 'seller-urban-point', count: 4 },
  { sellerId: 'seller-bayt-asima', count: 4 },
  { sellerId: 'seller-miftah', count: 3 },
  { sellerId: 'seller-delta-view', count: 3 },
  { sellerId: 'seller-harbor-line', count: 2 },
  { sellerId: 'seller-huda-mansour', count: 2 },
  { sellerId: 'seller-karim-shafie', count: 2 },
  { sellerId: 'seller-nora', count: 2 },
];

function withAgentSellers(properties: Property[]): Property[] {
  const queue = sellerAssignment.flatMap(({ sellerId, count }) =>
    Array.from({ length: count }, () => agentSellers[sellerId]),
  );

  return properties.map((property, index) => {
    const seller = queue[index];
    return seller ? { ...property, seller } : property;
  });
}

export const mockProperties: Property[] = [
  ...withAgentSellers(seedProperties.map(normalizeSeedProperty)),
  ...buildCompoundUnitListings(),
];

