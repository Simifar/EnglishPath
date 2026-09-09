import type { ReactNode } from 'react';
export function FilterBar({ children }: { children: ReactNode }) { return <div aria-label="Фильтры" className="flex flex-wrap gap-3 rounded-lg border bg-muted/30 p-4">{children}</div>; }
