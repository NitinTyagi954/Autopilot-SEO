'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '@/types';
import { api } from '@/lib/api';

interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  setCurrentSite: (site: Site | null) => void;
  isLoading: boolean;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  setCurrentSite: () => {},
  isLoading: true,
  refreshSites: async () => {},
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSites = async () => {
    try {
      setIsLoading(true);
      const res = await api.sites.list();
      const list = Array.isArray(res) ? res : res.results || [];
      setSites(list);
      if (list.length > 0 && !currentSite) {
        setCurrentSite(list[0]);
      }
    } catch (e) {
      console.error('Failed to load sites:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSites();
  }, []);

  return (
    <SiteContext.Provider
      value={{
        sites,
        currentSite,
        setCurrentSite,
        isLoading,
        refreshSites,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
