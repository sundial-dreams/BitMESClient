import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import reducer from "./reducer";

export default function createRootReducer (history) {
  return combineReducers({
    router: connectRouter(history),
    reducer
  });
}
