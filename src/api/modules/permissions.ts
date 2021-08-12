import { components } from '../generated/openapi'
import { create, findAll, remove, update } from '../generated/controllers/PermissionsController'
import { reactive, computed } from 'vue'
import { notEmpty } from '@/utils/common'
import { fixDates, FixedDates } from '@/utils/dates'

export type Permission = FixedDates<components['schemas']['Permission']>

const cachedById: Record<string, Permission> = reactive({})
const responseCache: Record<string, string[]> = reactive({})
const loading: Record<string, boolean> = reactive({})

const permissionsModule = {
  all() {
    const key = computed(() => 'all')

    const fetch = async () => {
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const result = await findAll()
          responseCache[key.value] = result.map(permission => {
            cachedById[permission.id] = fixDates(permission)
            return permission.id
          })
        } catch (e) {
          console.error(e)
        }
        loading[key.value] = false
      }
    }

    fetch()

    return {
      loading: computed(() => loading[key.value]),
      data: computed(() => (responseCache[key.value] ?? []).map(id => cachedById[id]).filter(notEmpty)),
      fetch,
    }
  },
  async create(body: components['schemas']['CreatePermissionsDto']) {
    const result = await create({ body })
    result.map(permission => {
      cachedById[permission.id] = fixDates(permission)
      responseCache['all']?.push(permission.id)
    })
    return result
  },
  async update(id: string, body: components['schemas']['UpdatePermissionDto']) {
    const permission = await update({
      path: {
        id,
      },
      body,
    })
    cachedById[permission.id] = fixDates(permission)
    return permission
  },
  async remove(id: string) {
    const permission = await remove({ path: { id } })
    delete cachedById[permission.id]
    return permission
  },
}

export const usePermissions = () => permissionsModule
