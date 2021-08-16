import { useDrivers } from '@/api/modules/drivers'
import { useTeams } from '@/api/modules/teams'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { PageLayout } from '@/components/layout/Page'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export const TeamsDriversIndexView = defineComponent({
  name: 'TeamsDriversIndexView',
  setup() {
    const teams = useTeams()
    const drivers = useDrivers()

    const create = async () => {
      const team = await teams.create()
      const driver = await drivers.create()
      await drivers.updateTeam(driver.id, team.id)
    }

    return () => (
      <PageLayout
        title="Teams & Drivers"
        button={() => (
          <Button class="flex flex-row" onClick={create}>
            <Icon name="mdiPlus" size="20" class="h-full mr-2 -ml-2" />
            Add Driver
          </Button>
        )}
      >
        <RouterView />
      </PageLayout>
    )
  },
})
