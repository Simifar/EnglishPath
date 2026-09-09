export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
// Use for native forms and public assets. Next Link adds basePath itself.
export function withBasePath(path: string) { return basePath + path; }
