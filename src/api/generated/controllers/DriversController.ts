import { request } from '../../api'
export const findAll = request('/drivers', 'get')
export const create = request('/drivers', 'post')
export const remove = request('/drivers/{id}', 'delete')
export const update = request('/drivers/{id}', 'patch')
export const updateTeam = request('/drivers/{id}/team/{teamId}', 'patch')
