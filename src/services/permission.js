import {stringify} from 'qs';
import request from '../utils/request';
import {getPlainNode} from "../utils/utils";


/**
 * 全部权限树
 * @returns {Promise<Object>}
 */
export async function page(payload) {
  return request(`/api/permission/page`, {
    method: 'GET',
    body: payload
  });
}

export async function getPermissionByParentId(payload) {
  return request(`/api/permission/getPermissionByParentId`, {
    method: 'GET',
    body: payload
  });
}
/**
 * 保存或者更新权限
 * @param payload
 * @returns {Promise<Object>}
 */
export async function saveOrUpdate(payload) {
  return request(`/api/permission/saveOrUpdate`, {
    method: 'POST',
    body: payload
  });
}
/**
 * 批量删除权限
 * @param payload
 * @returns {Promise<Object>}
 */
export async function deleteBatch(payload) {
  return request(`/api/permission/deleteBatch`, {
    method: 'POST',
    body: payload
  });
}

