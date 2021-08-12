import { request } from '../../api'
export const findAll = request('/drivers', 'get')
export const create = request('/drivers', 'post')
export const findOne = request('/drivers/{id}', 'get')
export const remove = request('/drivers/{id}', 'delete')
export const update = request('/drivers/{id}', 'patch')
