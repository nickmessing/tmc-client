import { PageLayout } from '@/components/layout/Page'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

export const UsersIndexView = defineComponent({
  name: 'UsersIndexView',
  setup() {
    return () => (
      <PageLayout title="Users">
        <RouterView />
      </PageLayout>
    )
  },
})
