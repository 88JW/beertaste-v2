import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

// Derive Supabase origin (if provided) to scope runtime caching.
// Avoid direct `process` usage at runtime in the service worker.
const supabaseOrigin = (() => {
  try {
    const envUrl =
      typeof process !== "undefined"
        ? process.env?.NEXT_PUBLIC_SUPABASE_URL
        : undefined;

    return envUrl ? new URL(envUrl).origin : null;
  } catch {
    return null;
  }
})();

const offlineFallback = "/offline.html";

const precacheEntries = self.__SW_MANIFEST ?? [];

const runtimeCaching = ([
  ...defaultCache,
  supabaseOrigin && {
    matcher: ({ url }: { url: URL }) => url.origin === supabaseOrigin,
    handler: "NetworkFirst",
    options: {
      cacheName: "supabase-data",
      networkTimeoutSeconds: 5,
      cacheableResponse: { statuses: [0, 200] },
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60,
      },
    },
  },
  {
    matcher: ({ request }: { request: Request }) => request.destination === "image",
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "images",
      cacheableResponse: { statuses: [0, 200] },
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      },
    },
  },
  {
    matcher: ({ request }: { request: Request }) => request.mode === "navigate",
    handler: "NetworkFirst",
    options: {
      cacheName: "pages",
      networkTimeoutSeconds: 5,
      plugins: [
        {
          handlerDidError: async () => {
            const cached = await caches.match(offlineFallback);
            if (cached) return cached;
            return Response.redirect(offlineFallback, 302);
          },
        },
      ],
    },
  },
] as unknown[]).filter(Boolean);

const serwist = new Serwist({
  precacheEntries: precacheEntries as any,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: runtimeCaching as any,
});

serwist.addEventListeners();
