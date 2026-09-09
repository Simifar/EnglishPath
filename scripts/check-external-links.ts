import { examGuides, resources, textbooks } from '../src/data';

const skippedHosts = new Set(['youtube.com', 'www.youtube.com']);
const delayMs = 300;
const links = [...textbooks, ...resources, ...examGuides].map(({ id, officialUrl }) => ({ id, url: officialUrl }));
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkLink({ id, url }: { id: string; url: string }) {
  const host = new URL(url).hostname;
  if (skippedHosts.has(host)) return console.log(`SKIP ${id}: ${host} blocks automated checks`);
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
    if (response.status === 405) response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15_000) });
    if (response.status >= 400) throw new Error(`HTTP ${response.status}`);
    console.log(`OK ${id}: ${response.status}`);
  } catch (error) { throw new Error(`Broken or unavailable link for ${id}: ${url} (${error instanceof Error ? error.message : error})`); }
}

for (const link of links) { await checkLink(link); await sleep(delayMs); }
