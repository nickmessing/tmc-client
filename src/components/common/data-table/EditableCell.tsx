import { typedProp } from '@/types/props'
import { onClickOutside } from '@/utils/clickOutside'
import { prevent, stop } from '@/utils/events'
import { defineComponent, ref, watch, onMounted } from 'vue'
import { Icon } from '../Icon'

export type ContextMenu = {
  label: string
  red?: boolean
  action: () => void
}[]

export const EditableCell = defineComponent({
  name: 'EditableCell',
  props: {
    value: {
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    focused: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: Boolean,
      default: false,
    },
    renderer: {
      type: typedProp<any>(Object),
    },
    editor: {
      type: typedProp<any>(Object),
    },
    contextMenu: {
      type: typedProp<ContextMenu>(Array),
    },
    onUpdate: {
      type: typedProp<(val: unknown) => Promise<unknown>>(Function),
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
  },
  setup(props) {
    const td = ref<HTMLTableDataCellElement | null>(null)
    const div = ref<HTMLDivElement | null>(null)

    const saving = ref(false)
    const contextMenuVisible = ref(false)

    const edit = () => props.editable && props.onEdit?.()

    const update = async (val: unknown) => {
      saving.value = true
      await props.onUpdate?.(val)
      props.focused && td.value?.focus()
      saving.value = false
    }
    const cancel = () => {
      props.onCancel?.()
      props.focused && td.value?.focus()
    }

    watch(
      () => props.focused,
      focused => focused && td.value?.focus(),
    )

    onMounted(() => props.focused && td.value?.focus())

    onClickOutside(div, () => {
      contextMenuVisible.value = false
    })

    return () => {
      const Editor = props.editor as any
      const Renderer = props.renderer as any

      return (
        <td ref={td} tabindex="0" class={{ editing: props.editing }} onFocus={props.onFocus} onDblclick={edit}>
          <div class={{ cell: true, 'opacity-20': saving.value }}>
            {props.contextMenu && (
              <div
                class="context-button"
                onClick={prevent(stop(() => (contextMenuVisible.value = !contextMenuVisible.value)))}
                onDblclick={prevent(stop())}
              >
                <Icon size="16" name="mdiDotsVertical" />
              </div>
            )}
            {props.contextMenu && (
              <div
                ref={div}
                class={{ 'context-menu': true, block: contextMenuVisible.value, hidden: !contextMenuVisible.value }}
              >
                {props.contextMenu.map(entry => (
                  <button
                    class={{ red: entry.red }}
                    onClick={() => {
                      contextMenuVisible.value = false
                      entry.action()
                    }}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            )}
            <div class="cell-container">
              {props.editing ? (
                <Editor initialValue={props.value} onUpdate={update} onCancel={cancel} focused />
              ) : (
                <div class="h-full w-full whitespace-nowrap overflow-hidden">
                  <Renderer value={props.value} />
                </div>
              )}
            </div>
          </div>
        </td>
      )
    }
  },
})
