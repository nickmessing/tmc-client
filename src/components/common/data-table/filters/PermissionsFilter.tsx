import { PermissionValue } from '@/api/generated/enums/PermissionValue'
import { typedProp } from '@/types/props'
import { defineComponent, onMounted, ref } from 'vue'
import { Dropdown } from '../../inputs/Dropdown'

export const PermissionsFilter = defineComponent({
  name: 'PermissionsFilter',
  props: {
    value: {
      type: typedProp<PermissionValue[]>(Array),
    },
    focused: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: typedProp<(val: PermissionValue[]) => void>(Function),
    },
    onUpdate: {
      type: typedProp<(val: PermissionValue[]) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const div = ref<HTMLDivElement | null>(null)

    const focus = () => {
      ;(div.value?.querySelector('div.dropdown') as undefined | HTMLDivElement)?.focus()
    }

    onMounted(focus)

    return () => (
      <div class="h-full w-full" ref={div}>
        <Dropdown
          value={props.value ?? []}
          focused={props.focused}
          options={Object.values(PermissionValue).map(val => ({ label: val, value: val }))}
          onInput={val => props.onInput?.(val as PermissionValue[])}
          onSubmit={val => props.onUpdate?.(val as PermissionValue[])}
          onCancel={props.onCancel}
          multiple
          placeholder
        />
      </div>
    )
  },
})
