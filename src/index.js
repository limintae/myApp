import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

//import react redux 
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import reducers from './store/reducers/'; // import reducers/index.js
import { Provider } from 'react-redux';

// import semantic ui css
import 'semantic-ui-css/semantic.min.css';

import * as serviceWorker from './serviceWorker';
//create logger
// const logger = createLogger();
//create store
// const store = createStore(reducers);
// const createStoreWithMiddleware = applyMiddleware(
//     thunkMiddleware, // function dispatch
//     loggerMiddleware // action logging
// )(createStore);
const store = createStore(reducers, applyMiddleware(ReduxThunk));
// const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

