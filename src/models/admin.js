import {list,deleteAdmin,saveOrUpdate,queryUser} from "../services/admin";
import {setAuthority} from '../utils/authority';
export default {
  namespace: 'admin',

  state: {
    list: [],
    currentUser: {
      username: '',
    },

    adminPageData:{
      list: [],
      pagination:{
        pageSize:10,
      },
    },

    adminItem:{},
    adminFormModalVisible:false,
    adminFormOption:'',
    loading:false,
  },

  effects: {

    *updateLoading({payload}, {call, put}){
      yield put({
        type: 'setLoading',
        payload: payload,
      });
    },


    *queryUser(_, {call, put}) {

        const response = yield call(queryUser);
        if (!response || response.code !='0') {
          return false;
        }
        localStorage.setItem('currentUserId', response.data.id);
        localStorage.setItem('currentUsername', response.data.username);
        setAuthority(response.data.currentAuthority);
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        return true;
    },

    /**
     * 获取管理员列表
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
      *list({payload}, {select,call, put}) {

          const param = () => {
            return ({search: payload.search||'', status: payload.status||''});
          };
          const response = yield call(list, param());
          if (!response || response.code !='0') {
            return false;
          }
          yield put({
            type: 'savePageData',
            payload: response,
          });
          return true;
    },
    * delete({payload}, {call, put}) {

        const response = yield call(deleteAdmin, {ids:payload.ids});
        if (!response || response.code !='0') {
          return false;
        }
        return true;
      },


      /**
       * admin编辑
       * @param payload
       * @param call
       * @param put
       * @returns {IterableIterator<*>}
       */
    *openEdit({payload}, {call, put}) {
        yield put({
          type: 'setAdminEdit',
          payload: payload,
        });
        yield put({
          type: 'showModal',
          payload: {
            modalType: 'admin'
          },
        });
      },
    * saveOrUpdate({payload}, {call, put}) {
        const response = yield call(saveOrUpdate, payload);
        if (!response || response.code !='0') {
          return false;
        }
        return true;
      },
  },

  reducers: {

    setLoading(state, action){
      return {
        ...state,
        loading: action.payload,
      };
    },

    //暂时从本地获取用户信息
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
        authority:action.payload.currentAuthority
      }
    },

    savePageData(state, action) {
      return {
        ...state,
        adminPageData: {
          list: action.payload.data,
          pagination:{
            total:action.payload.count,
          }
        },
      };
    },
    setAdminEdit(state, action) {
      return {
        ...state,
        adminItem: action.payload,
        adminFormOption: action.payload.length === 0 ? '添加' : '编辑',
      };
    },
    // 弹出框显示
    showModal(state, action) {
      //action.payload.modalType='admin' 操作admin编辑或者添加弹出框
      if (action.payload.modalType == 'admin') {
        return {...state, adminFormModalVisible: true};
      }else {
        return {...state};
      }
    },
    //弹出框关闭
    closeModal(state, action) {
      //action.payload.modalType='admin' 操作admin编辑或者添加弹出框
      if (action.payload.modalType == 'admin') {
        return {...state, adminFormModalVisible: false};
      }else {
        return {...state};
      }
    },
  },
};
