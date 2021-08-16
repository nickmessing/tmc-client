import { useUsers } from '@/api/modules/users'
import { computed, defineComponent } from 'vue'

export const DispatcherRenderer = defineComponent({
  name: 'DispatcherRenderer',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const users = useUsers()
    const all = users.all()

    const dispatcher = computed(() => all.data.value.find(user => user.id === props.value)?.name ?? 'None')

    return () => <div class="h-full w-full p-2 leading-6">{dispatcher.value}</div>
  },
})
