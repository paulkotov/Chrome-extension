import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

import reducer from './reducers';

class ContentScript {
  constructor() {
    this.isInit = false;

    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    chrome.runtime.sendMessage({ type: 'init-config' });
  }

  renderApp() {
	const store = createStore(reducer);
    let rootReact = document.createElement('div');
    rootReact.setAttribute('id', 'root-test');

    let body = document.body;
    body.appendChild(rootReact);

    render(
      <Provider store={store}>
        <App/>
      </Provider>
      , rootReact);
  }

  handleMessage(message) {
    if (message.type === 'config-init' && !this.isInit) {
      this.isInit = true;

      this.renderApp();
    }
  }
}

new ContentScript().renderApp();