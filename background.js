const createAudioWindow = async (notification = false) => {
  let url = chrome.runtime.getURL('audio.html');
  if (notification) {
    url += '?notification=1';
  }
  console.log(url);
  ({ id } = await chrome.windows.create({
    type: 'popup',
    focused: false,
    top: 1,
    left: 1,
    height: 1,
    width: 1,
    url,
  }));
  await chrome.windows.update(id, { focused: false });
  return id;
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log('onUpdated', tabId, changeInfo, tab);
  // notification condition
  if (
    changeInfo.status === 'complete' &&
    tab.url === 'https://bugs.chromium.org/p/chromium/issues/detail?id=1131236'
  ) {
    await createAudioWindow(true);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('onActivated', activeInfo);
});

chrome.action.onClicked.addListener(async ({ title, url }) => {
  const currentWindow = (
    await chrome.windows.getAll({ windowTypes: ['popup'] })
  ).find(
    ({ height, width, type }) => height === 1 && width === 1 && type === 'popup'
  );
  // toggle window open, close
  if (currentWindow) {
    await chrome.windows.remove(currentWindow.id);
  } else {
    await createAudioWindow();
  }
});
