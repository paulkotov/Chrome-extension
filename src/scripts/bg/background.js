// Расскоментировать если нужно использовать async await
// import 'babel-polyfill';

let config;

function sendMessageInit(config, tabId) {
  chrome.tabs.sendMessage(tabId, {
    type: 'config-init',
    config: config
  }, function() { });
}

function listenerHandler(authenticationTabId, mainTabId) {
  function getUrlParameterValue(url, parameterName) {
    let urlParameters = url.substr(url.indexOf('#') + 1),
        parameterValue = '',
        index,
        temp;

    urlParameters = urlParameters.split('&');

    for (index = 0; index < urlParameters.length; index += 1) {
      temp = urlParameters[index].split('=');

      if (temp[0] === parameterName)
        return temp[1];
    }

    return parameterValue;
  }

  function displayeAnError(textToShow, errorToShow) {
    alert(textToShow + '\n' + errorToShow);
  }

  return function tabUpdateListener(tabId, changeInfo) {
    let vkAccessToken;

    if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === 'loading') {
      if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
        authenticationTabId = null;
        chrome.tabs.onUpdated.removeListener(tabUpdateListener);

        vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');

        if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
          displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
          return;
        }

        config.vkToken = vkAccessToken;
        chrome.storage.local.set({ 'vkaccess_token': vkAccessToken }, function() { });
        chrome.tabs.update(mainTabId, { active: true });
        sendMessageInit(config, mainTabId);
      }
    }
  };
}

function vkAuth(config) {
  let vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' +
    config.vk.clientId + '&scope=' + config.vk.scope +
    '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    let mtab = tabs[0];
    chrome.storage.local.get({ 'vkaccess_token': {} }, items => {
      if (items.vkaccess_token.length === undefined) {
        chrome.tabs.create({ url: vkAuthenticationUrl, selected: true }, tab => {
          chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, mtab.id));
        });
      } else {
        config.vkToken =items.vkaccess_token;
        sendMessageInit(config, mtab.id);
      }
    });
  });
}

chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'init-config') {
    if (config) {
      vkAuth(config);
      return;
    }

    chrome.runtime.getPackageDirectoryEntry(root => {
      root.getFile('config.json', {}, fileEntry => {
        fileEntry.file(file => {
          let reader = new FileReader();
          reader.onloadend = function() {
            config = JSON.parse(this.result);
            vkAuth(config);
          };

          reader.readAsText(file);
        });
      });
    });
  }
});
