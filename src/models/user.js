import {queryById} from '../services/admin';

/**
 * 注意:这里是前台用户,非系统用户
 */
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {
      username: '',
    },
    userInfo: {}
  },

  effects: {
    * queryUsername(_, {call, put}) {
      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
    },
    * queryById({payload}, {call, put}) {
      const userId = localStorage.getItem('currentUserId')
      const response = yield call(queryById, {id: userId});
      if (response !== undefined && response.code == '0') {
        yield put({
          type: 'saveUserInfo',
          payload: response,
        });
      }

    },
  },

  reducers: {
    //暂时从本地获取用户信息
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: {
          username: localStorage.getItem('currentUsername'),
        }
      }
    },
//保存用户信息
    saveUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload.data,
      }
    },
  },
};
