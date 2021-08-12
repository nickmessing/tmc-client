import { computed, reactive } from 'vue'
import { request } from './api/api'
import { PermissionAction } from './api/generated/enums/PermissionAction'
import { PermissionModel } from './api/generated/enums/PermissionModel'
import { PermissionValue } from './api/generated/enums/PermissionValue'
import { components } from './api/generated/openapi'

interface State {
  token: null | string
  authenticationResult: components['schemas']['AuthenticationResult'] | null
  userToken: string | null
}

export const state = reactive<State>({
  token: null,
  authenticationResult: null,
  userToken: null,
})

window.google.accounts.id.initialize({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID!,
  async callback(data) {
    state.token = data.credential
    await authenticate()
  },
})

const authenticate = async () => {
  if (state.token == null) {
    throw new Error('no auth token')
  }
  const res = await request('/users/authenticate', 'get')()
  state.userToken = res.token
  state.authenticationResult = res.data
  localStorage.setItem('google-token', state.token)
}

;(async () => {
  try {
    const data = localStorage.getItem('google-token')
    if (data == null) {
      throw new Error('no token')
    }
    state.token = data
    await authenticate()
  } catch (e) {
    console.log(e)
    window.google.accounts.id.prompt()
  }
})()

const authenticated = computed(() => {
  return state.authenticationResult != null
})
const user = computed(() => state.authenticationResult?.user ?? null)
const permission = (action: PermissionAction, model: PermissionModel) =>
  state.authenticationResult?.permissions.find(permission => permission.model === model && permission.action === action)
    ?.value ?? PermissionValue.None
const can = (action: PermissionAction, model: PermissionModel) => permission(action, model) !== PermissionValue.None

const authModule = {
  authenticated,
  user,
  permission,
  can,
}

export const useAuth = () => authModule
