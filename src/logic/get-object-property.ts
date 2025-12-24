export function getObjectProperty<T = any>(
  obj: Record<string, unknown>,
  key: string,
): T | undefined {
  const keys = key.split('.')

  return keys.reduce((acc, currentKey) => acc[currentKey] as any, obj) as T
}
