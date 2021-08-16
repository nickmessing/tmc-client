import { components } from '../generated/openapi'
import { create, findAll, remove, update, updateDispatcher } from '../generated/controllers/TeamsController'
import { reactive, computed } from 'vue'
import { notEmpty } from '@/utils/common'
import { fixDates, FixedDates } from '@/utils/dates'

export type Team = FixedDates<components['schemas']['Team']>

const cachedById: Record<string, Team | null> = reactive({})
const responseCache: Record<string, string[]> = reactive({})
const loading: Record<string, boolean> = reactive({})

const teamsModule = {
  all() {
    const key = computed(() => 'all')

    const fetch = async () => {
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const result = await findAll()
          responseCache[key.value] = result.map(team => {
            cachedById[team.id] = fixDates(team)
            return team.id
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
  async create() {
    const team = await create()
    cachedById[team.id] = fixDates(team)
    responseCache['all']?.push(team.id)
    return team
  },
  async update(id: string, body: components['schemas']['UpdateCommonDto']) {
    const team = await update({
      path: {
        id,
      },
      body,
    })
    cachedById[team.id] = fixDates(team)
    return team
  },
  async updateDispatcher(id: string, dispatcherId: string) {
    const driver = await updateDispatcher({
      path: {
        id,
        dispatcherId,
      },
    })
    cachedById[driver.id] = fixDates(driver)
    return driver
  },
  async remove(id: string) {
    const team = await remove({ path: { id } })
    cachedById[id] = null
    return team
  },
}

export const useTeams = () => teamsModule
