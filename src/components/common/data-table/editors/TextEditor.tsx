import { typedProp } from '@/types/props'
import { group, key, prevent, stop } from '@/utils/events'
import { defineComponent, onBeforeMount, onMounted, ref, watch } from 'vue'

export const TextEditor = defineComponent({
  name: 'TextEditor',
  props: {
    placeholder: {
      type: Boolean,
      default: false,
    },
    initialValue: {
      required: false,
    },
    value: {
      required: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    focused: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: typedProp<(val: string) => void>(Function),
    },
    onFocus: {
      type: typedProp<() => void>(Function),
    },
    onUpdate: {
      type: typedProp<(val: string) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const value = ref('')
    const input = ref<HTMLInputElement | null>(null)

    onBeforeMount(() => {
      value.value = props.initialValue ? String(props.initialValue) : props.value ? String(props.value) : ''
    })

    onMounted(() => {
      if (props.focused) {
        input.value?.focus()
        input.value?.select()
      }
    })

    watch(
      () => props.focused,
      val => {
        if (val) {
          input.value?.focus()
          input.value?.select()
        }
      },
    )

    watch(
      () => props.value,
      val => {
        value.value = val ? String(val) : ''
      },
    )

    const setVal = (val: string) => {
      value.value = val
      props.onInput?.(val)
    }

    return () => (
      <div
        class={{
          'h-full w-full flex items-center': true,
          'p-1': props.plain,
        }}
      >
        <input
          ref={input}
          type="text"
          placeholder={props.placeholder ? 'Search' : ''}
          class={{
            'text-input': true,
            plain: props.plain,
          }}
          value={value.value}
          onInput={event => setVal((event.target as HTMLInputElement).value)}
          onKeydown={stop(
            group(
              key(
                'Enter',
                prevent(() => props.onUpdate?.(value.value)),
              ),
              key(
                'Escape',
                prevent(() => props.onCancel?.()),
              ),
            ),
          )}
          onFocus={props.onFocus}
        />
      </div>
    )
  },
})
