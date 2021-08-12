import { components } from '../generated/openapi'
import { findAll, create, findOne, remove, update } from '../generated/controllers/RolesController'
import { Ref, reactive, computed, watch } from 'vue'
import { notEmpty } from '@/utils/common'
import { isEqual } from 'lodash'
import { fixDates, FixedDates } from '@/utils/dates'

export type Role = FixedDates<components['schemas']['Role']>

const cachedById: Record<string, Role | null> = reactive({})
const responseCache: Record<string, string[]> = reactive({})
const loading: Record<string, boolean> = reactive({})

const rolesModule = {
  all() {
    const key = computed(() => 'all')

    const fetch = async () => {
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const result = await findAll()
          responseCache[key.value] = result.map(role => {
            cachedById[role.id] = fixDates(role)
            return role.id
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
  one(id: Ref<string>) {
    const key = computed(() => `one_${id.value}`)

    const fetch = async () => {
      if (!id.value) {
        return
      }
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const role = await findOne({ path: { id: id.value } })
          if (!isEqual(role, cachedById[role.id])) {
            cachedById[role.id] = fixDates(role)
          }
        } catch (e) {
          console.error(e)
        }
        loading[key.value] = false
      }
    }

    watch(() => id.value, fetch, { deep: true, immediate: true })

    return {
      loading: computed(() => loading[key.value]),
      data: computed(() => cachedById[id.value]),
      fetch,
    }
  },
  async create(body: Parameters<typeof create>[0]['body']) {
    const role = await create({ body })
    cachedById[role.id] = fixDates(role)
    responseCache['all']?.push(role.id)
    return role
  },
  async update(id: string, body: Parameters<typeof update>[0]['body']) {
    const role = await update({
      path: {
        id,
      },
      body,
    })
    cachedById[role.id] = fixDates(role)
    return role
  },
  async remove(id: string) {
    const role = await remove({ path: { id } })
    cachedById[id] = null
    return role
  },
}

export const useRoles = () => rolesModule
