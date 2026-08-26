chrome.devtools.panels.create('GraphQL Network', '', 'index.html', (panel) => {
  panel.onShown.addListener((window) => {
    window.postMessage({ type: 'PANEL_SHOWN' }, '*')
  })
})
