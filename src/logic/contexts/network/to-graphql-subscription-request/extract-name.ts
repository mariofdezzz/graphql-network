import { extractQuery } from '../to-graphql-request/extract-query'

export function extractName(payload: any): string {
  const query = extractQuery(payload)

  const name =
    payload?.operationName ??
    /subscription\s*(?<name>\w+)/.exec(query)?.groups?.name ??
    '(anonymous)'

  return name
}
