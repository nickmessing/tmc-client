import { typedProp } from '@/types/props'
import { group, key, prevent, stop } from '@/utils/events'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { Icon } from '../Icon'

export const Dropdown = defineComponent({
  name: 'Dropdown',
  props: {
    value: {
      type: typedProp<string | string[]>([String, Array]),
      required: true,
    },
    options: {
      type: typedProp<{ label: string; value: string }[]>(Array),
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    focused: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    onInput: {
      type: typedProp<(val: string | string[]) => void>(Function),
    },
    onSubmit: {
      type: typedProp<(val: string | string[]) => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const div = ref<HTMLDivElement | null>(null)
    const inputEl = ref<HTMLInputElement | null>(null)

    const activeSelect = ref(-1)
    const mouseOver = ref(false)
    const searching = ref(false)
    const searchString = ref('')

    const isSelected = (value: string) =>
      props.multiple ? (props.value as string[]).includes(value) : value === props.value

    onMounted(async () => {
      if (props.focused) {
        await nextTick()
        if (props.searchable) {
          inputEl.value?.focus()
        } else {
          div.value?.focus()
        }
      }
      activeSelect.value = props.options.findIndex(option => isSelected(option.value))
    })

    watch(
      () => props.focused,
      async focused => {
        await nextTick()
        if (focused) {
          if (props.searchable) {
            inputEl.value?.focus()
          } else {
            div.value?.focus()
          }
        }
      },
    )

    const moveDown = () => activeSelect.value < props.options.length - 1 && activeSelect.value++
    const moveUp = () => activeSelect.value > 0 && activeSelect.value--

    const submit = (value?: string) => {
      if (value == null) {
        return
      }
      if (props.multiple) {
        const oldVal = props.value as string[]
        const newVal = oldVal.includes(value) ? oldVal.filter(val => val !== value) : [...oldVal, value]
        props.onInput?.(newVal)
        props.onSubmit?.(newVal)
      } else {
        props.onInput?.(value)
        props.onSubmit?.(value)
      }
    }

    const input = (value?: string) => {
      if (value == null) {
        return
      }
      if (props.multiple) {
        const oldVal = props.value as string[]
        const newVal = oldVal.includes(value) ? oldVal.filter(val => val !== value) : [...oldVal, value]
        props.onInput?.(newVal)
      } else {
        props.onInput?.(value)
      }
    }

    const displayText = computed(() =>
      props.multiple
        ? (props.value as string[]).map(val => props.options.find(opt => opt.value === val)?.label ?? '').join(', ')
        : props.options.find(opt => opt.value === (props.value as string))?.label ?? '',
    )

    const filteredOptions = computed(() =>
      searchString.value
        ? props.options.filter(option => option.label.toLocaleLowerCase().includes(searchString.value))
        : props.options,
    )

    watch(
      () => searchString.value,
      () => (activeSelect.value = 0),
    )

    return () => (
      <div
        class="dropdown p-1"
        tabindex="0"
        ref={div}
        onKeydown={group(
          key('ArrowDown', stop(prevent(moveDown))),
          key('ArrowUp', stop(prevent(moveUp))),
          key('Enter', stop(prevent(() => submit(filteredOptions.value[activeSelect.value]?.value)))),
          key(' ', stop(prevent(() => input(filteredOptions.value[activeSelect.value]?.value)))),
          key('Escape', stop(prevent(props.onCancel))),
        )}
      >
        <div
          class={{
            'h-full w-full overflow-hidden whitespace-nowrap py-1 px-2 leading-6 ': true,
            'bg-bg1 rounded-lg': props.placeholder,
            'text-left text-xs leading-6 text-placeholder': !displayText.value,
          }}
        >
          {displayText.value || 'Select'}
        </div>
        <div
          class={{ options: true, visible: searching.value || props.focused }}
          onMouseenter={() => (mouseOver.value = true)}
          onMouseleave={() => (mouseOver.value = false)}
        >
          {props.searchable && (
            <input
              ref={inputEl}
              value={searchString.value}
              type="text"
              placeholder="Search"
              class="rounded-lg bg-bg1 w-full h-10 mb-2 px-2 outline-none"
              onInput={event => (searchString.value = (event.target as HTMLInputElement).value)}
              onFocus={() => (searching.value = true)}
              onBlur={() => (searching.value = false)}
            />
          )}
          {filteredOptions.value.map((option, index) => (
            <div
              class={{
                option: true,
                active: !mouseOver.value && activeSelect.value === index,
              }}
              onClick={() => submit(option.value)}
            >
              <div>{option.label}</div>
              {isSelected(option.value) && <Icon name="mdiCheck" size="20" class="text-primary-main" />}
            </div>
          ))}
        </div>
      </div>
    )
  },
})
