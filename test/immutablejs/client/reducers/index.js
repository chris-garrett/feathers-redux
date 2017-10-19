
import { combineReducers } from 'redux-immutable';

export default function (reduxifiedServices) {
  return combineReducers({
    users: reduxifiedServices.users.reducer,
    messages: reduxifiedServices.messages.reducer
  });
}


