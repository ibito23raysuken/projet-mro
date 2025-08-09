export async function fetchEndpoint() {
  const response = await fetch('/api/ping', { signal });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}