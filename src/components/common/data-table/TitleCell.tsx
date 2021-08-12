import { typedProp } from '@/types/props'
import { key, prevent, stop } from '@/utils/events'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { Icon } from '../Icon'
import { TableColumn } from './Table'

export const TitleCell = defineComponent({
  name: 'TitleCell',
  props: {
    column: {
      type: typedProp<TableColumn<any>>(Object),
      required: true,
    },
    focused: {
      type: Boolean,
      default: false,
    },
    sorting: {
      type: String,
    },
    onFocus: {
      type: typedProp<() => void>(Function),
    },
    onToggle: {
      type: typedProp<() => void>(Function),
    },
  },
  setup(props) {
    const th = ref<HTMLTableDataCellElement | null>(null)

    watch(
      () => props.focused,
      focused => focused && th.value?.focus(),
    )

    onMounted(() => props.focused && th.value?.focus())

    return () => (
      <th
        ref={th}
        tabindex="0"
        class={{ sortable: props.column.sortable }}
        onFocus={props.onFocus}
        onKeydown={prevent(stop(key(['Enter', ' '], props.onToggle)))}
      >
        <div class={{ label: true, sorting: props.sorting }} onClick={props.onToggle}>
          <div>{props.column.label}</div>
          {props.sorting && <Icon class={props.sorting} name="mdiArrowRight" size="12" />}
        </div>
      </th>
    )
  },
})
