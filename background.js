async function onClicked(tab) {
  console.log(tab);
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html?id=' + tab.id),
    active: true
  });
}

chrome.action.onClicked.addListener(onClicked);
