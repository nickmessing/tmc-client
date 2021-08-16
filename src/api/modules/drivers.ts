import { components } from '../generated/openapi'
import { findAll, remove, update, updateTeam, create } from '../generated/controllers/DriversController'
import { reactive, computed } from 'vue'
import { notEmpty } from '@/utils/common'
import { fixDates, FixedDates } from '@/utils/dates'

export type Driver = FixedDates<components['schemas']['Driver']>

const cachedById: Record<string, Driver | null> = reactive({})
const responseCache: Record<string, string[]> = reactive({})
const loading: Record<string, boolean> = reactive({})

const driversModule = {
  all() {
    const key = computed(() => 'all')

    const fetch = async () => {
      if (!loading[key.value]) {
        loading[key.value] = true
        try {
          const result = await findAll()
          responseCache[key.value] = result.map(driver => {
            cachedById[driver.id] = fixDates(driver)
            return driver.id
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
    const driver = await create()
    cachedById[driver.id] = fixDates(driver)
    responseCache['all']?.push(driver.id)
    return driver
  },
  async update(id: string, body: components['schemas']['UpdateCommonDto']) {
    const driver = await update({
      path: {
        id,
      },
      body,
    })
    cachedById[driver.id] = fixDates(driver)
    return driver
  },
  async updateTeam(id: string, teamId: string) {
    const driver = await updateTeam({
      path: {
        id,
        teamId,
      },
    })
    cachedById[driver.id] = fixDates(driver)
    return driver
  },
  async remove(id: string) {
    const driver = await remove({ path: { id } })
    cachedById[id] = null
    return driver
  },
}

export const useDrivers = () => driversModule
