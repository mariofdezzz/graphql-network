export function onPageReload(onReload: () => void) {
  let currentUrl = ''

  chrome.devtools?.inspectedWindow.eval('window.location.href', (url: string, err) => {
    if (!err) currentUrl = url
  })

  chrome.devtools?.network.onNavigated.addListener((url) => {
    if (currentUrl === url) onReload()
    currentUrl = url
  })
}
