import type { ChromeNetworkRequest } from '@/types/chrome-network-request'

type UseDevtoolsNetworkOptions = {
  onRequestFinished?: (request: ChromeNetworkRequest) => void
}

export function useDevtoolsNetwork({ onRequestFinished }: UseDevtoolsNetworkOptions = {}) {
  chrome.devtools?.network.onRequestFinished.addListener((request) => {
    if (onRequestFinished) onRequestFinished(request)
  })

  return {}
}
