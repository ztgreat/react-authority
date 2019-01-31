import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 登录
 * @param payload 用户名、密码
 * @returns {Promise<Object>}
 */
export async function page(payload) {
  return request(`/api/role/page`, {
    method: 'GET',
    body: payload
  });
}

/**
 * 获取所有用户角色信息
 * @param payload
 * @returns {Promise<Object>}
 */
export async function pageUserRoles(payload) {
  return request(`/api/role/pageUserRoles`, {
    method: 'GET',
    body: payload
  });
}
/**
 * 获取某个用户角色信息
 * @param payload
 * @returns {Promise<Object>}
 */
export async function querySingleUserRole(payload) {
  return request(`/api/role/querySingleUserRole/`+payload, {
    method: 'GET',
    body: payload
  });
}

/**
 * 更新用户拥有的角色信息
 * @param payload
 * @returns {Promise<Object>}
 */
export async function updateUserRoles(payload) {
  return request(`/api/role/updateUserRoles`, {
    method: 'POST',
    body: payload
  });

}

/**
 * 获取当前用户信息
 */
export async function queryCurrent() {
  return request('/api/currentUser');
}

/**
 *更新角色信息
 */
export async function saveOrUpdate(payload) {
  return request(`/api/role/saveOrUpdate`, {
    method: 'POST',
    body: payload
  });

}
/**
 * 批量删除角色
 * @param payload
 * @returns {Promise<Object>}
 */
export async function deleteBatch(payload) {
  return request(`/api/role/deleteBatch`, {
    method: 'POST',
    body: payload
  });
}
/**
 * 删除角色
 * @param payload
 * @returns {Promise<Object>}
 */
export async function deleteRole(payload) {
  return request(`/api/role/delete`, {
    method: 'POST',
    body: payload
  });
}

/**
 * 获取角色相关的菜单树
 * @param payload
 * @returns {Promise<Object>}
 */
export async function getMenuTreeByRoleId(payload) {
  return request(`/api/role/getMenuTreeByRoleId`, {
    method: 'GET',
    body: payload
  });
}
/**
 * 获取角色相关的资源树
 * @param payload
 * @returns {Promise<Object>}
 */
export async function getPermissionTreeByRoleId(payload) {
  return request(`/api/role/getPermissionTreeByRoleId`, {
    method: 'GET',
    body: payload
  });
}
/**
 * 更新角色相关的菜单树
 * @param payload
 * @returns {Promise<Object>}
 */
export async function updateMenus(payload) {
  return request(`/api/role/updateMenus`, {
    method: 'POST',
    body: payload
  });
}
/**
 * 更新角色相关的资源树
 * @param payload
 * @returns {Promise<Object>}
 */
export async function updatePermission(payload) {
  return request(`/api/role/updatePermission`, {
    method: 'POST',
    body: payload
  });
}



