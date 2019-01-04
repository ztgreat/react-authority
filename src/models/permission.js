import {deleteBatch, getPermissionByParentId, getPermissionTree, saveOrUpdate} from '../services/permission';

export default {
  namespace: 'permission',

  state: {
    list: [],
    permissionTree: {
      list: [],
      pagination:{
        pageSize:10,
        total:10,
      }
    },
    parentPermission:[],
    permissionFormModalVisible:false,
    permissionItem:{},
    loading:false,
  },

  effects: {

    *updateLoading({payload}, {call, put}){
      yield put({
        type: 'setLoading',
        payload: payload,
      });
    },
    * getPermissionTree({payload}, {select,call, put}) {
        const searchParam = yield select(({permission}) => {
          return ({current: payload.current||1});
        });
        const response = yield call(getPermissionTree,searchParam);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'saveAll',
          payload: response,
        });
        return true;
    },
    * getPermissionByParentId({payload}, {select,call, put}) {
        const response = yield call(getPermissionByParentId,payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'setParentPermission',
          payload: response,
        });
        return true;
    },

    /**
     * 打开permission 弹窗
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
      *openPermissionForm({payload}, {call, put}) {
          yield put({
            type: 'setPermissionItem',
            payload: payload,
          });
          yield put({
            type: 'setPermissionFormModalVisible',
            payload: true,
          });
    },
    *closePermissionForm({payload}, {call, put}) {
        yield put({
          type: 'setPermissionFormModalVisible',
          payload: false,
        });
    },
    * saveOrUpdate({payload}, {call, put}) {
        const response = yield call(saveOrUpdate, payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type:"closePermissionForm"
        })
        return true;
    },
    * delete({payload}, {call, put}) {
        const response = yield call(deleteBatch, payload);
        if (!response || response.code !='0') {
          return false;
        }
        return true
    },
  },

  reducers: {
    setLoading(state, action){
      return {
        ...state,
        loading: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        permissionTree: {
          list: action.payload.data,
          pagination:{
            total:action.payload.count,
          }
        },
      };
    },
    setParentPermission(state, action) {
      return {
        ...state,
        parentPermission: action.payload.data,
      };
    },
    setPermissionItem(state, action) {
      return {
        ...state,
        permissionItem: action.payload
      };
    },
    setPermissionFormModalVisible(state, action) {
      return {
        ...state,
        permissionFormModalVisible: action.payload
      };
    },
  },

};
