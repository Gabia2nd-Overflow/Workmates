const key = (id) => `wsmeta:${id}`;

export function getWsMeta(id) {
  try { return JSON.parse(sessionStorage.getItem(key(id)) || "null"); }
  catch { return null; }
}
export function setWsMeta(id, meta) {
  const payload = { name: meta?.name || "", logo: meta?.logo || null };
  try { sessionStorage.setItem(key(id), JSON.stringify(payload)); } catch {}
}