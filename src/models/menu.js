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
  },

  effects: {
    * getUserMenuTree({payload}, {call, put}) {
      const response = yield call(getUserMenuTree, payload);
      if (!response || response.code =='1') {
        return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
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


    * getMenuTree({payload}, {call, put}) {
      const response = yield call(getMenuTree);
      if (!response) {
        return;
      }
      yield put({
        type: 'saveAll',
        payload: response.data,
      });
    },
    * saveOrUpdate({payload}, {call, put}) {
        const response = yield call(saveOrUpdate, payload);
        if (!response) {
            return;
        }
        if(response.code=='0'){
          yield put({
            type:"closeMenuForm"
          })

        }

    },
    * delete({payload}, {call, put}) {
        const response = yield call(deleteBatch, payload);
        if (!response) {

        }
    },

  },

  reducers: {
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
