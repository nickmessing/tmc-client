import { typedProp } from '@/types/props'
import { defineComponent, onMounted, ref } from 'vue'
import { Dropdown } from '../../inputs/Dropdown'

export const DefaultFilter = defineComponent({
  name: 'DefaultFilter',
  props: {
    value: {
      type: typedProp<string[]>(Array),
    },
    focused: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: typedProp<(val: string[]) => void>(Function),
    },
    onUpdate: {
      type: typedProp<(val: string[]) => void>(Function),
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
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
          onInput={val => props.onInput?.(val as string[])}
          onSubmit={val => props.onUpdate?.(val as string[])}
          onCancel={props.onCancel}
          multiple
          placeholder
        />
      </div>
    )
  },
})
