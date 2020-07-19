import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import homeSaga from "./saga/homeSaga";

export const sagaMiddleware = createSagaMiddleware(); 

export function* rootSaga() {
  yield all([
      ...homeSaga
  ]);
}