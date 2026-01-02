import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

export function onNetworkRequestFinished(
  onRequestFinished: (request: ChromeNetworkRequest) => void,
) {
  chrome.devtools?.network.onRequestFinished.addListener((request) => {
    onRequestFinished(request)
  })
}
