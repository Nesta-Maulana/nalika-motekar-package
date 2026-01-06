'use client';

import { useEffect, useState, useMemo } from 'react';

export type DomainType = 'central' | 'tenant';

interface DomainInfo {
  type: DomainType;
  subdomain: string | null;
  domain: string;
  isCentral: boolean;
  isTenant: boolean;
  tenantSlug: string | null;
}

const CENTRAL_DOMAINS = (process.env.NEXT_PUBLIC_CENTRAL_DOMAINS || 'nalika-motekar.local,admin.nalika-motekar.local,localhost,localhost:3000')
  .split(',')
  .map(d => d.trim());

const CENTRAL_SUBDOMAINS = (process.env.NEXT_PUBLIC_CENTRAL_SUBDOMAINS || 'admin,www,')
  .split(',')
  .map(s => s.trim());

export function useDomainDetect(): DomainInfo {
  const [domain, setDomain] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const fullDomain = port ? `${hostname}:${port}` : hostname;

      setDomain(fullDomain);

      const parts = hostname.split('.');
      if (parts.length > 2) {
        setSubdomain(parts[0]);
      } else if (parts.length === 2 && parts[0] !== 'localhost') {
        setSubdomain(parts[0]);
      } else {
        setSubdomain(null);
      }
    }
  }, []);

  const domainInfo = useMemo<DomainInfo>(() => {
    const isExactCentralDomain = CENTRAL_DOMAINS.includes(domain) ||
      CENTRAL_DOMAINS.includes(domain.replace(/:\d+$/, ''));

    const isCentralSubdomain = subdomain === null || CENTRAL_SUBDOMAINS.includes(subdomain);
    const isCentral = isExactCentralDomain || isCentralSubdomain;
    const isTenant = !isExactCentralDomain && subdomain !== null && !CENTRAL_SUBDOMAINS.includes(subdomain);

    return {
      type: isTenant ? 'tenant' : 'central',
      subdomain,
      domain,
      isCentral,
      isTenant,
      tenantSlug: isTenant ? subdomain : null,
    };
  }, [domain, subdomain]);

  return domainInfo;
}

export function getDomainInfo(): DomainInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'central',
      subdomain: null,
      domain: '',
      isCentral: true,
      isTenant: false,
      tenantSlug: null,
    };
  }

  const hostname = window.location.hostname;
  const port = window.location.port;
  const domain = port ? `${hostname}:${port}` : hostname;

  const parts = hostname.split('.');
  let subdomain: string | null = null;

  if (parts.length > 2) {
    subdomain = parts[0];
  } else if (parts.length === 2 && parts[0] !== 'localhost') {
    subdomain = parts[0];
  }

  const isExactCentralDomain = CENTRAL_DOMAINS.includes(domain) ||
    CENTRAL_DOMAINS.includes(domain.replace(/:\d+$/, ''));

  const isCentralSubdomain = subdomain === null || CENTRAL_SUBDOMAINS.includes(subdomain);
  const isCentral = isExactCentralDomain || isCentralSubdomain;
  const isTenant = !isExactCentralDomain && subdomain !== null && !CENTRAL_SUBDOMAINS.includes(subdomain);

  return {
    type: isTenant ? 'tenant' : 'central',
    subdomain,
    domain,
    isCentral,
    isTenant,
    tenantSlug: isTenant ? subdomain : null,
  };
}

export default useDomainDetect;
