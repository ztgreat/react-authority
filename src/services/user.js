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
