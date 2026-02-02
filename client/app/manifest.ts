import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BeerTaste v2',
    short_name: 'BeerTaste',
    description: 'Osobista aplikacja do katalogowania i recenzowania piw. 129 recenzji z profesjonalnymi ocenami i zdjęciami.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1f2937',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
