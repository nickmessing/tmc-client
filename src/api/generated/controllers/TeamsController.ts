import { request } from '../../api'
export const findAll = request('/teams', 'get')
export const create = request('/teams', 'post')
export const remove = request('/teams/{id}', 'delete')
export const update = request('/teams/{id}', 'patch')
export const updateDispatcher = request('/teams/{id}/dispatcher/{dispatcherId}', 'patch')
