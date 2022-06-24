import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import dayjs from "dayjs";
import jaLocale from "dayjs/locale/ja";
import rootSaga from "./rootSaga";
import rootReducer from "./rootReducer";
import "./style/index.less";

import App from "./App";
dayjs.locale({ ...jaLocale, weekStart: 1 }, null, true);

const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
