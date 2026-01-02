import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export class PreflightRequestMap {
  private preflights: ChromeNetworkRequest[] = []

  add(preflight: ChromeNetworkRequest) {
    this.preflights.push(preflight)
  }

  get(request: ChromeNetworkRequest) {
    const requestStartedAt = new Date(request.startedDateTime).getTime()

    const preflight = this.preflights
      .filter(
        (preflight) =>
          preflight.request.url === request.request.url &&
          new Date(preflight.startedDateTime).getTime() - requestStartedAt < 5000,
      )
      .reduce<ChromeNetworkRequest | undefined>((latest, current) => {
        if (!latest) return current

        const latestTime = new Date(latest.startedDateTime).getTime()
        const currentTime = new Date(current.startedDateTime).getTime()

        const latestDelta = Math.abs(
          latestTime - requestStartedAt + latest.time - Number(request._blocked_queueing ?? 0),
        )
        const currentDelta = Math.abs(
          currentTime - requestStartedAt + current.time - Number(request._blocked_queueing ?? 0),
        )

        return currentDelta < latestDelta ? current : latest
      }, undefined)

    if (preflight)
      return {
        ...preflight,
        _x_preflight_for: request,
      }
  }
}
