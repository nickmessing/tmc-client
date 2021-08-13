import { Role } from '@/api/modules/roles'
import { typedProp } from '@/types/props'
import { defineComponent } from 'vue'

export const RoleRenderer = defineComponent({
  name: 'RoleRenderer',
  props: {
    value: {
      type: typedProp<Role>(Object),
    },
  },
  setup(props) {
    return () => (
      <div class="h-full w-full p-2 leading-6">
        <span
          class={{
            'inline-block leading-4 px-2 py-1 rounded-lg': true,
            'bg-bg2': !props.value?.default,
            'bg-primary-main': props.value?.default,
          }}
        >
          {props.value?.label ?? 'Loading...'}
        </span>
      </div>
    )
  },
})
