import { type ReactNode } from 'react';
import { FileX, Inbox, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyProps {
  icon?: 'inbox' | 'file' | 'search' | ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const iconMap = {
  inbox: Inbox,
  file: FileX,
  search: Search,
};

export function Empty({
  icon = 'inbox',
  title = 'Tidak ada data',
  description,
  action,
  className,
}: EmptyProps) {
  const IconComponent =
    typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      {IconComponent ? (
        <IconComponent className="h-12 w-12 text-muted-foreground/50" />
      ) : (
        icon
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function EmptySearch({ query }: { query?: string }) {
  return (
    <Empty
      icon="search"
      title="Tidak ditemukan"
      description={
        query
          ? 'Tidak ada hasil untuk "' + query + '". Coba kata kunci lain.'
          : 'Tidak ada hasil yang ditemukan.'
      }
    />
  );
}

export function EmptyList({ entity = 'data' }: { entity?: string }) {
  return (
    <Empty
      icon="inbox"
      title={'Belum ada ' + entity}
      description={entity.charAt(0).toUpperCase() + entity.slice(1) + ' akan muncul di sini setelah ditambahkan.'}
    />
  );
}
