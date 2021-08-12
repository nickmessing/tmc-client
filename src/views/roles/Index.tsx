import { useRoles } from '@/api/modules/roles'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { PageLayout } from '@/components/layout/Page'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export const RoleIndexView = defineComponent({
  name: 'RoleIndexView',
  setup() {
    const roles = useRoles()

    return () => (
      <PageLayout
        title="Roles"
        button={() => (
          <Button class="flex flex-row" onClick={() => roles.create({ label: 'New Role' })}>
            <Icon name="mdiPlus" size="20" class="h-full mr-2 -ml-2" />
            Add Role
          </Button>
        )}
      >
        <RouterView />
      </PageLayout>
    )
  },
})
