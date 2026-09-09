import { Award, ChartNoAxesCombined, CircleCheck, Flag, GraduationCap, Sprout, type LucideIcon } from 'lucide-react';
import type { CefrLevel } from '@/data';

const icons: Record<CefrLevel, LucideIcon> = { A1: Sprout, A2: Flag, B1: ChartNoAxesCombined, B2: CircleCheck, C1: GraduationCap, C2: Award };
export function CefrLevelIcon({ level, className = 'h-5 w-5' }: { level: CefrLevel | string; className?: string }) { const Icon = icons[level as CefrLevel] ?? ChartNoAxesCombined; return <Icon aria-hidden="true" className={className} />; }
