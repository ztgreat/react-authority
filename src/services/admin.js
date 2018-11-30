import {stringify} from 'qs';
import request from '../utils/request';

/**
 * 登录
 * @param payload 用户名、密码
 * @returns {Promise<Object>}
 */
export async function login(payload) {
  return request(`/api/login`, {
    method: 'POST',
    body: {
      username: payload.username,
      password: payload.password,
    }
  });

}

/**
 * 退出登录
 * @returns {Promise<Object>}
 */
export async function logout() {
  return request('/api/logout', {
    method: 'GET',
  });

}


/**
 * oauth 授权
 * @returns {Promise<Object>}
 */
export async function oauth(payload) {
  return request(`/api/oauth/authorize`, {
    method: 'GET',
    body: payload
  });

}



/**
 * 获取管理员列表
 * @returns {Promise<Object>}
 */
export async function list(payload) {
  return request('/api/admin/page', {
    method: 'GET',
    body: payload,
  });

}


/**
 * 获取管理员列表
 * @returns {Promise<Object>}
 */
export async function deleteAdmin(payload) {
  return request('/api/admin/delete', {
    method: 'POST',
    body: payload,
  });

}

export async function saveOrUpdate(payload) {
  return request('/api/admin/saveOrUpdate', {
    method: 'POST',
    body: payload,
  });
}

/**
 * 查询当前登录用户
 * @param payload
 * @returns {Promise<Object>}
 */
export async function queryUser() {
  return request(`/api/admin/query`, {
    method: 'GET',
    body: {},
  });

}




