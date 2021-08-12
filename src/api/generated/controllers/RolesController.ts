import { request } from '../../api'
export const findAll = request('/roles', 'get')
export const create = request('/roles', 'post')
export const findOne = request('/roles/{id}', 'get')
export const remove = request('/roles/{id}', 'delete')
export const update = request('/roles/{id}', 'patch')
