import { typedProp } from '@/types/props'
import { defineComponent, ref, watch, onMounted } from 'vue'

export const FilterCell = defineComponent({
  name: 'FilterCell',
  props: {
    value: {
      required: false,
    },
    focused: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: Boolean,
      default: false,
    },
    editor: {
      type: typedProp<any>(Object),
    },
    onInput: {
      type: typedProp<(val: unknown) => void>(Function),
    },
    onFocus: {
      type: typedProp<() => void>(Function),
    },
    onEdit: {
      type: typedProp<() => void>(Function),
    },
    onCancel: {
      type: typedProp<() => void>(Function),
    },
    onClear: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const th = ref<HTMLTableDataCellElement | null>(null)

    const cancel = () => {
      props.onCancel?.()
      props.focused && th.value?.focus()
    }

    const clear = () => {
      props.onClear?.()
      props.focused && th.value?.focus()
    }

    watch(
      () => props.focused,
      focused => focused && th.value?.focus(),
    )

    onMounted(() => props.focused && th.value?.focus())

    return () => {
      const Editor = props.editor as any

      return (
        <th ref={th} tabindex="0" class={{ 'h-10': true, editing: props.editing }} onFocus={props.onFocus}>
          <div class="cell">
            <div class="cell-container">
              {Editor && (
                <Editor
                  value={props.value}
                  focused={props.editing}
                  onInput={props.onInput}
                  onCancel={clear}
                  onUpdate={cancel}
                  onFocus={props.onEdit}
                  plain
                  placeholder
                />
              )}
            </div>
          </div>
        </th>
      )
    }
  },
})
