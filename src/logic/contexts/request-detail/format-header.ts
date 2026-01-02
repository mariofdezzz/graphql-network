export function formatHeader(name: string): string {
  if (name.startsWith(':')) return name

  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-')
}
