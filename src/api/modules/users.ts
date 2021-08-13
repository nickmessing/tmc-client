import { components } from '../generated/openapi'
import { find, remove, update } from '../generated/controllers/UsersController'
import { reactive, computed } from 'vue'
import { notEmpty } from '@/utils/common'
import { fixDates, FixedDates } from '@/utils/dates'

export type User = FixedDates<components['schemas']['User']>

const cachedById: Record<string, User | null> = reactive({})
const responseCache: Record<string, string[]> = reactive({})
const loading: Record<string, boolean> = reactive({})

const usersModule = {
  all() {
    const key = computed(() => 'all')

    const fetch = async () => {
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const result = await find()
          responseCache[key.value] = result.map(user => {
            cachedById[user.id] = fixDates(user)
            return user.id
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
  async update(id: string, body: components['schemas']['UpdateUserDto']) {
    const user = await update({
      path: {
        id,
      },
      body,
    })
    cachedById[user.id] = fixDates(user)
    return user
  },
  async remove(id: string) {
    const user = await remove({ path: { id } })
    cachedById[id] = null
    return user
  },
}

export const useUsers = () => usersModule
