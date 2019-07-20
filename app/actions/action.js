import * as ActionType from '../constants/actionType';

export function login (email, avatar) {
  return {
    type: ActionType.LOGIN,
    isLogin: true,
    email,
    avatar
  };
}

export function logout () {
  return {
    type: ActionType.LOGOUT,
    isLogin: false,
    email: '',
    avatar: ''
  };
}

export function scheduleResultComing (scheduleResult) {
  return {
    type: ActionType.SCHEDULE_RESULT_COMING,
    scheduleResult
  }
}