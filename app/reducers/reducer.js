import * as ActionType from '../constants/actionType';

const initialState = {
  isLogin: false,
  email: '',
  avatar: '',
  scheduleResult: {
    fulfillTime: 0,
    result: []
  }
};

export default function(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case ActionType.LOGIN: {
      Reflect.deleteProperty(action, "type");
      return {
        ...state,
        ...action
      };
    }
    case ActionType.LOGOUT: {
      Reflect.deleteProperty(action, "type");
      return {
        ...state,
        ...action
      };
    }
    case ActionType.SCHEDULE_RESULT_COMING: {
      Reflect.deleteProperty(action, "type");
      return {
        ...state,
        ...action
      }
    }
    default: {
      return state;
    }
  }
}