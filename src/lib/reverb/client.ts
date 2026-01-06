'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { storage } from '../utils/storage';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'reverb'>;
  }
}

let echoInstance: Echo<'reverb'> | null = null;

export function initializeEcho(): Echo<'reverb'> | null {
  if (typeof window === 'undefined') return null;

  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  const token = storage.getToken();

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_KEY || 'nalika-reverb-key',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080', 10),
    wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8080', 10),
    forceTLS: process.env.NODE_ENV === 'production',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
      },
    },
  });

  window.Echo = echoInstance;

  return echoInstance;
}

export function getEcho(): Echo<'reverb'> | null {
  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

export function updateEchoAuth(token: string): void {
  if (echoInstance) {
    echoInstance.connector.options.auth.headers.Authorization = `Bearer ${token}`;
  }
}

export default {
  initialize: initializeEcho,
  get: getEcho,
  disconnect: disconnectEcho,
  updateAuth: updateEchoAuth,
};
