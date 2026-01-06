'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '../../lib/utils';
import { useSiteConfigStore, getBranding } from '../../stores/siteConfigStore';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const imageSizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export function Logo({
  size = 'md',
  showText = true,
  className,
  href = '/',
}: LogoProps) {
  const config = useSiteConfigStore((state) => state.config);
  const branding = config?.branding ?? getBranding();
  const brandName = branding.name;
  const logoUrl = branding.logo_url;
  const hasLogo = logoUrl && logoUrl !== '/images/logo.png';

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      {hasLogo ? (
        <Image
          src={logoUrl}
          alt={brandName}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className={cn('rounded-lg object-contain', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold',
            sizeClasses[size]
          )}
        >
          {brandName.charAt(0).toUpperCase()}
        </div>
      )}
      {showText && (
        <span className={cn('font-bold tracking-tight', textSizeClasses[size])}>
          {brandName}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

export function LogoIcon({ size = 'md', className }: Omit<LogoProps, 'showText' | 'href'>) {
  const config = useSiteConfigStore((state) => state.config);
  const branding = config?.branding ?? getBranding();
  const brandName = branding.name;
  const logoUrl = branding.logo_url;
  const hasLogo = logoUrl && logoUrl !== '/images/logo.png';

  if (hasLogo) {
    return (
      <Image
        src={logoUrl}
        alt={brandName}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className={cn('rounded-lg object-contain', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold',
        sizeClasses[size],
        className
      )}
    >
      {brandName.charAt(0).toUpperCase()}
    </div>
  );
}
