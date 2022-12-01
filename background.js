async function onClicked(tab) {
  if (await chrome.offscreen.hasDocument()) {
    await chrome.offscreen.closeDocument();
  }
  chrome.offscreen.createDocument({
    url: 'index.html',
    justification: 'ignored',
    reasons: ['AUDIO_PLAYBACK']
  });
}

chrome.action.onClicked.addListener(onClicked);