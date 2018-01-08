import React from "react";
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { soundManager } from 'soundmanager2';

// Setup soundManager
soundManager.setup({ ignoreMobileRestrictions: true });

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

export default jsx;
