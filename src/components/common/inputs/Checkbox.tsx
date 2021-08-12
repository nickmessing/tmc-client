import { typedProp } from '@/types/props'
import { group, key, prevent, stop } from '@/utils/events'
import { defineComponent, ref } from 'vue'
import { Icon } from '../Icon'

export const Checkbox = defineComponent({
  name: 'Checkbox',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: typedProp<(val: boolean) => void>(Function),
    },
    onSubmit: {
      type: typedProp<(val: boolean) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const div = ref<HTMLDivElement | null>(null)

    return () => (
      <div
        ref={div}
        tabindex="0"
        class={{
          checkbox: true,
          'border-icon': !props.value,
          'border-primary-main bg-primary-main': props.value,
          'opacity-75': props.disabled,
          'cursor-pointer': !props.disabled,
        }}
        onClick={() => {
          div.value?.focus()
          const newVal = !props.value
          props.onInput?.(newVal)
          props.onSubmit?.(newVal)
        }}
        onKeydown={group(
          key('Enter', prevent(stop(() => props.onSubmit?.(props.value)))),
          key('Escape', prevent(stop(() => props.onCancel?.()))),
          key(' ', prevent(stop(() => props.onInput?.(!props.value)))),
        )}
      >
        {props.value && <Icon name="mdiCheck" size="16" />}
      </div>
    )
  },
})
