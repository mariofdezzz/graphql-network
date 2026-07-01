export type ChromeNetworkRequest = chrome.devtools.network.Request & {
  _requestId?: string
  _connectionId?: string
  _x_preflight_for?: ChromeNetworkRequest
}
