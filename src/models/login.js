import {routerRedux} from 'dva/router';
import {setAuthority} from '../utils/authority';
import {login, logout, oauth} from '../services/admin';
import {reloadAuthorized} from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    * login({payload}, {call, put}) {
        const response = yield call(login, payload);

        if (!response || response.code !='0') {
          return false;
        }
        // 登录成功
        response.data['currentAuthority']='user';
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        localStorage.setItem('currentUserId', response.data.id);
        localStorage.setItem('currentUsername', response.data.username);
        reloadAuthorized();
        yield put(routerRedux.push('/home'));
    },


    * oauthLogin({payload}, {call, put}) {
        const response = yield call(login, payload);
        // 登录成功
        if (!response || response.code !='0') {
          return false;
        }
        response.data['currentAuthority']='user';
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        localStorage.setItem('currentUserId', response.data.id);
        localStorage.setItem('currentUsername', response.data.username);
        reloadAuthorized();
        return true;
    },


    * oauthAuthorize({payload}, {call, put}) {
        const response = yield call(oauth, payload);
        // 登录成功
        if (!response || response.code !='0') {
          return false;
        }
        response.data['currentAuthority']='user';

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        localStorage.setItem('currentUserId', response.data.id);
        localStorage.setItem('currentUsername', response.data.username);
        reloadAuthorized();

        const res = yield call(oauth, payload);


        yield put(routerRedux.push('/home'));
    },


    * logout(_, {call, put, select}) {
        try {
          const response = yield call(logout);
          if (response !== undefined && response.code === '0') {
            yield put({
              type: 'logoutSuccess',
            });
            // get location pathname
            const urlParams = new URL(window.location.href);
            const pathname = yield select(state => state.routing.location.pathname);
            // add the parameters in the url
            urlParams.searchParams.set('redirect', pathname);
            window.history.replaceState(null, 'login', urlParams.href);
          }
        } finally {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              data: {
                status: false,
                currentAuthority: 'guest',
              }
            },
          });
          //reloadAuthorized();
          yield put(routerRedux.push('/user/login'));
        }
      },
  },

  reducers: {
    changeLoginStatus(state, {payload}) {
      //设置当前登录用户角色信息到本地
      setAuthority(payload.data.currentAuthority);
      //登录成功
      const status = payload.code === '0' ? true : false;
      return {
        ...state,
        status: status,
      };
    },
    logoutSuccess(state, {payload}) {
      setAuthority([]);
      return {
        ...state,
        currentUser: {},
      };
    },
  },
};
