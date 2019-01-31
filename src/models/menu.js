import {deleteBatch, getMenuTree, getUserMenuTree, saveOrUpdate} from '../services/menu';

export default {
  namespace: 'menu',
  state: {
    list: [],
    menuTree: {
      list: [],
      pagination:{
        pageSize:20
      }
    },
    menuFormModalVisible:false,
    menuItem:{},
    loading:false,
  },

  effects: {

    *updateLoading({payload}, {call, put}){

      yield put({
        type: 'setLoading',
        payload: payload,
      });
    },

    * getUserMenuTree({payload}, {call, put}) {
        const response = yield call(getUserMenuTree, payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'save',
          payload: response.data,
        });
        return true;
    },


    /**
     * 打开menu 弹窗
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
      *openMenuForm({payload}, {call, put}) {
          yield put({
            type: 'setMenuItem',
            payload: payload,
          });
          yield put({
            type: 'setMenuFormModalVisible',
            payload: true,
          });
    },

    *closeMenuForm({payload}, {call, put}) {
        yield put({
          type: 'setMenuFormModalVisible',
          payload: false,
        });
    },


    *getMenuTree({payload}, {call, put}) {
        const response = yield call(getMenuTree);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'saveAll',
          payload: response.data,
        });
        return true;
    },
    * saveOrUpdate({payload}, {call, put}) {
        const response = yield call(saveOrUpdate, payload);
        if (!response || response.code !='0') {
          return false;
        }
        if(response.code=='0'){
          yield put({
            type:"closeMenuForm"
          })
        }
        return true;
    },
    * delete({payload}, {call, put}) {
        const response = yield call(deleteBatch, payload);
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

    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        menuTree: {
          list: action.payload,
        },
      };
    },

    setMenuItem(state, action) {
      return {
        ...state,
        menuItem: action.payload
      };
    },
    setMenuFormModalVisible(state, action) {
      return {
        ...state,
        menuFormModalVisible: action.payload
      };
    },
  },

};
