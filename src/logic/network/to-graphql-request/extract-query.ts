export function extractQuery(payload: any): string {
  return payload?.query?.trim() ?? ''
}
