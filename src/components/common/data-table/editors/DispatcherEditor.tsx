import { useUsers } from '@/api/modules/users'
import { typedProp } from '@/types/props'
import { computed, defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import { Dropdown } from '../../inputs/Dropdown'

export const DispatcherEditor = defineComponent({
  name: 'DispatcherEditor',
  props: {
    initialValue: {
      type: String,
      required: true,
    },
    onUpdate: {
      type: typedProp<(val: string) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const users = useUsers()
    const all = users.all()

    const value = ref('')
    const div = ref<HTMLDivElement | null>(null)

    const focus = () => {
      ;(div.value?.querySelector('div.dropdown') as undefined | HTMLDivElement)?.focus()
    }

    onBeforeMount(() => {
      value.value = props.initialValue
    })

    onMounted(focus)

    const options = computed(() => [
      { label: 'None', value: 'null' },
      ...all.data.value.map(user => ({ label: user.name, value: user.id })),
    ])

    return () => (
      <div class="h-full w-full" ref={div}>
        <Dropdown
          value={value.value}
          options={options.value}
          searchable
          onInput={val => (value.value = val as string)}
          onSubmit={val => props.onUpdate?.(val as string)}
          onCancel={props.onCancel}
        />
      </div>
    )
  },
})
