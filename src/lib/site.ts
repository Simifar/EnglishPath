export const siteUrl = new URL((process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cortexmap.ru').replace(/\/?$/, '/'));
export function absoluteSiteUrl(path: string) { return new URL(path.replace(/^\//, ''), siteUrl).toString(); }
export const siteName = 'CortexMap';
export const siteDescription = 'Справочник по планам CEFR, экзаменам, учебникам и легальным ресурсам для изучения английского языка.';
