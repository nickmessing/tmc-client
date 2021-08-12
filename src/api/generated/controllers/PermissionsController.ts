import { request } from '../../api'
export const findAll = request('/permissions', 'get')
export const create = request('/permissions', 'post')
export const remove = request('/permissions/{id}', 'delete')
export const update = request('/permissions/{id}', 'patch')
