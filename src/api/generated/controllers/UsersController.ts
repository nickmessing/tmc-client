import { request } from '../../api'
export const me = request('/users/authenticate', 'get')
export const find = request('/users', 'get')
export const findOne = request('/users/{id}', 'get')
export const remove = request('/users/{id}', 'delete')
export const update = request('/users/{id}', 'patch')
