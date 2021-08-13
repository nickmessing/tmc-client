import { useRoles } from '@/api/modules/roles'
import { computed, defineComponent } from 'vue'

export const RoleRenderer = defineComponent({
  name: 'RoleRenderer',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const roles = useRoles()
    const all = roles.all()

    const activeRole = computed(() => all.data.value.find(role => role.id === props.value))

    return () => (
      <div class="h-full w-full p-2 leading-6">
        <span
          class={{
            'inline-block leading-4 px-2 py-1 rounded-lg': true,
            'bg-bg2': activeRole.value?.default,
            'bg-primary-main text-white': !activeRole.value?.default,
          }}
        >
          {activeRole.value?.label ?? 'Loading...'}
        </span>
      </div>
    )
  },
})
