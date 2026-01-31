import { Metadata } from 'next';

export const schemaMarkup = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': 'https://nagalka-advokat.ua',
  name: 'Nagalka Advokat',
  description: 'Адвокатська контора спеціалізується на рекламному праві',
  url: 'https://nagalka-advokat.ua',
  image: 'https://nagalka-advokat.ua/assets/images/Hover-image.webp',
  telephone: '+38 (0XX) XXX-XX-XX',
  email: 'contact@nagalka-advokat.ua',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Вулиця, Дім',
    addressLocality: 'Київ',
    addressRegion: 'Київська',
    postalCode: 'XXXXX',
    addressCountry: 'UA',
  },
  areaServed: 'UA',
  priceRange: '$$',
  sameAs: [
    'https://facebook.com/nagalka-advokat',
    'https://instagram.com/nagalka-advokat',
    'https://www.linkedin.com/company/nagalka-advokat',
  ],
  foundingDate: '20XX',
  founder: {
    '@type': 'Person',
    name: 'ПІБ засновника',
  },
};
