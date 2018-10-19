import {list,deleteAdmin,saveOrUpdate} from "../services/admin";

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
  },

  effects: {
    * queryUsername(_, {call, put}) {
      yield put({
        type: 'saveCurrentUser',
        payload: {},
      });
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
      if (!response) {
        return;
      }
      yield put({
        type: 'savePageData',
        payload: response,
      });
    },
    * delete({payload}, {call, put}) {

      const response = yield call(deleteAdmin, {ids:payload.ids});
      if (!response) {

      }},


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
        if (!response) {

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
