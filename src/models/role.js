import {
  deleteRole,
  getMenuTreeByRoleId,
  getPermissionTreeByRoleId,
  page,
  pageUserRoles,
  querySingleUserRole,
  saveOrUpdate,
  updateMenus,
  updatePermission,
  updateUserRoles
} from '../services/role';
import {getDefaultCheckKeys} from '../utils/utils';

export default {
  namespace: 'role',

  state: {
    //角色数据源
    pageData: {
      list: [],
      pagination: {
        pageSize: 10,
      },
    },
    //添加删除标题
    roleFormOption: '添加',
    // 编辑、添加角色弹出框标志位
    roleFormModalVisible: false,
    // 菜单授权弹出框标志
    menuAuthModalVisible: false,
    // 资源授权弹出框标志
    permissionAuthModalVisible: false,
    //编辑角色数据
    roleItem: {},
    /**
     * 选中用户已经有的角色
     */
    userRoles: [],

    /**
     * 该角色已经有的和没有的菜单
     */
    roleMenu: [],

    /**
     * 该角色已经有的和没有的权限资源
     */
    rolePermission: [],

    /**
     * 树型数据选中的key
     */
    checkedKeys:[],

    loading:false,
  },
  effects: {

    *updateLoading({payload}, {call, put}){
      yield put({
        type: 'setLoading',
        payload: payload,
      });
    },

    * page({payload}, {call, put}) {
        const response = yield call(page, payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'savePageData',
          payload: response,
        });
        return true;
    },
    * pageUserRoles({payload}, {select,call, put}) {
        const response = yield call(pageUserRoles,payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'savePageData',
          payload: response,
        });
        return true;
    },
    /**
     * 查询单个用户角色信息
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * querySingleUserRole({payload}, {call, put}) {
        const response = yield call(querySingleUserRole, payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'saveUserRoles',
          payload: response,
        });
        return true;

    },

    /**
     *  更新单个用户角色信息
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * updateUserRoles({payload}, {call, put}) {
        const response = yield call(updateUserRoles, payload);
        if (!response || response.code !='0') {
          return false;
        }
        return true;
    },

    /**
     * 更新角色信息
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * saveOrUpdate({payload}, {call, put}) {
        const response = yield call(saveOrUpdate, payload);
        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'closeModal',
          payload: {
            modalType: 'role'
          },
        });
        return true;
    },
    * delete({payload}, {call, put}) {
        const response = yield call(deleteRole, payload);
        if (!response || response.code !='0') {
          return false;
        }
        return true;
    },

    /**
     * 更新角色菜单树
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *updateMenus({payload}, {select,call, put}) {

        const param = yield select(({role}) => {
          return ({roleId: role.roleItem.id||0, menusIds: payload.menusIds});
        });

        const response = yield call(updateMenus, param);
        if (!response || response.code !='0') {
          return false;
        }
        return true;
    },

    /**
     * 更新角色权限资源树
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    * updatePermission({payload}, {select,call, put}) {

        const param = yield select(({role}) => {
          return ({roleId: role.roleItem.id||0, permissionIds: payload.permissionIds});
        });
        const response = yield call(updatePermission, param);
        if (!response || response.code !='0') {
          return false;
        }
        return true;
    },
    /**
     * 角色编辑
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *openEdit({payload}, {call, put}) {
        yield put({
          type: 'setRoleEdit',
          payload: payload,
        });
        yield put({
          type: 'showModal',
          payload: {
            modalType: 'role'
          },
        });
    },


    /**
     * 显示菜单授权弹窗
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *showModalRoleMenu({payload}, {call, put}) {

        const response = yield call(getMenuTreeByRoleId, {roleId:payload.record.id});

        if (!response || response.code !='0') {
          return false;
        }
        yield put({
          type: 'saveRoleMenu',
          payload: response,
        });

        yield put({
          type: 'setRoleItem',
          payload: payload.record,
        });
        yield put({
          type: 'showModal',
          payload: {
            modalType: 'authMenu'
          },
        });
        return true;
    },


    /**
     * 显示资源授权弹窗
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
      *showModalRolePermission({payload}, {call, put}) {

          const response = yield call(getPermissionTreeByRoleId, {roleId:payload.record.id});
          if (!response || response.code !='0') {
            return false;
          }
          yield put({
            type: 'saveRolePermission',
            payload: response,
          });

          yield put({
            type: 'setRoleItem',
            payload: payload.record,
          });
          yield put({
            type: 'showModal',
            payload: {
              modalType: 'authPermission'
            },
          });
          return true;
     },

    *updateCheckedKeys({payload},{call, put}) {
        yield put({
          type: 'setCheckedKeys',
          payload: payload,
        });
    },

  },

  reducers: {
    setLoading(state, action){
      return {
        ...state,
        loading: action.payload,
      };
    },
    savePageData(state, action) {
      return {
        ...state,
        pageData: {
          list: action.payload.data,
          pagination: {
            current:action.payload.current,
            pageSize:action.payload.pageSize,
            total:action.payload.total,
          }
        },
      };
    },
    saveUserRoles(state, action) {
      return {
        ...state,
        userRoles: action.payload.data,
      };
    },

    saveRoleMenu(state, action) {
      return {
        ...state,
        roleMenu: action.payload.data,
        checkedKeys:getDefaultCheckKeys(action.payload.data)
      };
    },
    saveRolePermission(state, action) {
      return {
        ...state,
        rolePermission: action.payload.data,
        checkedKeys:getDefaultCheckKeys(action.payload.data)
      };
    },
    // 角色编辑
    setRoleEdit(state, action) {
      return {
        ...state,
        roleItem: action.payload,
        roleFormOption: action.payload.length === 0 ? '添加' : '编辑',
      };
    },
    setRoleItem(state, action) {
      return {
        ...state,
        roleItem: action.payload,
      };
    },
    setCheckedKeys(state, action) {
      return {
        ...state,
        checkedKeys: action.payload,
      };
    },

    // 弹出框显示
    showModal(state, action) {
      //action.payload.modalType='role' 操作角色编辑或者添加弹出框
      //action.payload.modalType='authMenu' 操作菜单授权弹出框
      //action.payload.modalType='authPermission' 操作资源授权弹出框
      if (action.payload.modalType == 'role') {
        return {...state, roleFormModalVisible: true};
      } else if (action.payload.modalType == 'authMenu') {
        return {...state, menuAuthModalVisible: true};
      } else if (action.payload.modalType == 'authPermission') {
        return {...state, permissionAuthModalVisible: true};
      } else {
        return {...state};
      }
    },
    //弹出框关闭
    closeModal(state, action) {
      //action.payload.modalType='role' 操作角色编辑或者添加弹出框
      //action.payload.modalType='authMenu' 操作菜单授权弹出框
      //action.payload.modalType='authPermission' 操作资源授权弹出框
      if (action.payload.modalType == 'role') {
        return {...state, roleFormModalVisible: false};
      } else if (action.payload.modalType == 'authMenu') {
        return {...state, menuAuthModalVisible: false};
      } else if (action.payload.modalType == 'authPermission') {
        return {...state, permissionAuthModalVisible: false};
      } else {
        return {...state};
      }
    },
  },
};
