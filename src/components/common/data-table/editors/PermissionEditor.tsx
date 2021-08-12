import { PermissionValue } from '@/api/generated/enums/PermissionValue'
import { typedProp } from '@/types/props'
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import { Dropdown } from '../../inputs/Dropdown'

export const PermissionEditor = defineComponent({
  name: 'PermissionEditor',
  props: {
    initialValue: {
      type: typedProp<PermissionValue>(String),
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
    const value = ref(PermissionValue.None)
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
          options={Object.values(PermissionValue).map(val => ({ label: val, value: val }))}
          onInput={val => (value.value = val as PermissionValue)}
          onSubmit={val => props.onUpdate?.(val as PermissionValue)}
          onCancel={props.onCancel}
        />
      </div>
    )
  },
})
