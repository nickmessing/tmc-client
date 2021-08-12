import { typedProp } from '@/types/props'
import { defineComponent, ref, watch, onMounted } from 'vue'

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
    const saving = ref(false)

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

    const td = ref<HTMLTableDataCellElement | null>(null)

    watch(
      () => props.focused,
      focused => focused && td.value?.focus(),
    )

    onMounted(() => props.focused && td.value?.focus())

    return () => {
      const Editor = props.editor as any
      const Renderer = props.renderer as any

      return (
        <td ref={td} tabindex="0" class={{ editing: props.editing }} onFocus={props.onFocus} onDblclick={edit}>
          <div class={{ cell: true, 'opacity-20': saving.value }}>
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
