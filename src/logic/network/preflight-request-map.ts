import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export class PreflightRequestMap {
  private preflights: ChromeNetworkRequest[] = []

  add(preflight: ChromeNetworkRequest) {
    this.preflights.push(preflight)
  }

  get(request: ChromeNetworkRequest) {
    const requestStartedAt = new Date(request.startedDateTime).getTime()

    return this.preflights
      .filter(
        (preflight) =>
          preflight.request.url === request.request.url &&
          new Date(preflight.startedDateTime).getTime() - requestStartedAt < 5000,
      )
      .reduce<ChromeNetworkRequest | undefined>((latest, current) => {
        if (!latest) return current

        const latestTime = new Date(latest.startedDateTime).getTime()
        const currentTime = new Date(current.startedDateTime).getTime()

        const latestDelta = latestTime - requestStartedAt + latest.time - request.time
        const currentDelta = currentTime - requestStartedAt + current.time - request.time

        return currentDelta < latestDelta ? current : latest
      }, undefined)
  }
}
