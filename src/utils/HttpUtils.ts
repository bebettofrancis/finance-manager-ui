export async function makeRequest<T>(url: string) {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.error(err)) as Promise<T>;
}
