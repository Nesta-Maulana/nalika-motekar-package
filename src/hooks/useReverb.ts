'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getEcho, initializeEcho, disconnectEcho } from '../lib/reverb';
import { useAuthStore } from '../stores';

interface UseReverbOptions {
  autoConnect?: boolean;
}

export function useReverb(options: UseReverbOptions = { autoConnect: true }) {
  const [isConnected, setIsConnected] = useState(false);
  const { token, isHydrated } = useAuthStore();
  const listenersRef = useRef<Map<string, Map<string, () => void>>>(new Map());

  useEffect(() => {
    if (!isHydrated || !token || !options.autoConnect) return;

    const echo = initializeEcho();
    if (echo) {
      setIsConnected(true);
    }

    return () => {
      listenersRef.current.forEach((events, channel) => {
        events.forEach((cleanup) => cleanup());
      });
      listenersRef.current.clear();
    };
  }, [isHydrated, token, options.autoConnect]);

  const subscribe = useCallback(
    (channel: string, event: string, callback: (data: unknown) => void) => {
      const echo = getEcho();
      if (!echo) return;

      const channelInstance = echo.private(channel);
      channelInstance.listen(event, callback);

      if (!listenersRef.current.has(channel)) {
        listenersRef.current.set(channel, new Map());
      }
      listenersRef.current.get(channel)?.set(event, () => {
        channelInstance.stopListening(event);
      });
    },
    []
  );

  const unsubscribe = useCallback((channel: string, event?: string) => {
    const echo = getEcho();
    if (!echo) return;

    const channelEvents = listenersRef.current.get(channel);
    if (!channelEvents) return;

    if (event) {
      const cleanup = channelEvents.get(event);
      if (cleanup) {
        cleanup();
        channelEvents.delete(event);
      }
    } else {
      channelEvents.forEach((cleanup) => cleanup());
      listenersRef.current.delete(channel);
      echo.leave(channel);
    }
  }, []);

  const leaveChannel = useCallback((channel: string) => {
    const echo = getEcho();
    if (!echo) return;

    const channelEvents = listenersRef.current.get(channel);
    if (channelEvents) {
      channelEvents.forEach((cleanup) => cleanup());
      listenersRef.current.delete(channel);
    }

    echo.leave(channel);
  }, []);

  const disconnect = useCallback(() => {
    listenersRef.current.forEach((events) => {
      events.forEach((cleanup) => cleanup());
    });
    listenersRef.current.clear();
    disconnectEcho();
    setIsConnected(false);
  }, []);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    leaveChannel,
    disconnect,
  };
}

export function useChannel(
  channel: string,
  events: Record<string, (data: unknown) => void>
) {
  const { subscribe, unsubscribe } = useReverb();
  const { isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    Object.entries(events).forEach(([event, callback]) => {
      subscribe(channel, event, callback);
    });

    return () => {
      Object.keys(events).forEach((event) => {
        unsubscribe(channel, event);
      });
    };
  }, [isHydrated, channel, events, subscribe, unsubscribe]);
}
