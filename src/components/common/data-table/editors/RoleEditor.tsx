import { PermissionValue } from '@/api/generated/enums/PermissionValue'
import { useRoles } from '@/api/modules/roles'
import { typedProp } from '@/types/props'
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import { Dropdown } from '../../inputs/Dropdown'

export const RoleEditor = defineComponent({
  name: 'RoleEditor',
  props: {
    initialValue: {
      type: String,
      required: true,
    },
    onUpdate: {
      type: typedProp<(val: PermissionValue) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const roles = useRoles()
    const all = roles.all()

    const value = ref('')
    const div = ref<HTMLDivElement | null>(null)

    const focus = () => {
      ;(div.value?.querySelector('div.dropdown') as undefined | HTMLDivElement)?.focus()
    }

    onBeforeMount(() => {
      value.value = props.initialValue
    })

    onMounted(focus)

    return () => (
      <div class="h-full w-full" ref={div}>
        <Dropdown
          value={value.value}
          options={all.data.value.map(role => ({ label: role.label, value: role.id }))}
          searchable
          onInput={val => (value.value = val as PermissionValue)}
          onSubmit={val => props.onUpdate?.(val as PermissionValue)}
          onCancel={props.onCancel}
        />
      </div>
    )
  },
})
