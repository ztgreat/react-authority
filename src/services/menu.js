import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 根据用户获取菜单
 * @param payload
 * @returns {Promise<Object>}
 */
export async function getUserMenuTree(payload) {
  return request(`/api/menu/getUserMenuTree`, {
    method: 'GET',
    body: payload
  });
}

/**
 * 全部菜单树
 * @returns {Promise<Obj ect>}
 */
export async function getMenuTree() {
  return request(`/api/menu/getMenuTree`, {
    method: 'GET',
    body: {}
  });
}
/**
 * 保存或者更新菜单
 * @param payload
 * @returns {Promise<Object>}
 */
export async function saveOrUpdate(payload) {
  return request(`/api/menu/saveOrUpdate`, {
    method: 'POST',
    body: payload
  });
}
/**
 * 批量删除菜单
 * @param payload
 * @returns {Promise<Object>}
 */
export async function deleteBatch(payload) {
  return request(`/api/menu/deleteBatch`, {
    method: 'POST',
    body: payload
  });
}

