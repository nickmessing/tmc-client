import { request } from '../../api'
export const findAll = request('/loads', 'get')
export const create = request('/loads', 'post')
export const findOne = request('/loads/{id}', 'get')
export const remove = request('/loads/{id}', 'delete')
export const update = request('/loads/{id}', 'patch')
