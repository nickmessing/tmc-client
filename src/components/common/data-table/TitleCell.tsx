import { typedProp } from '@/types/props'
import { defineComponent, onMounted, ref, watch } from 'vue'
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
    onFocus: {
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
      <th ref={th} tabindex="0" class={{ sortable: props.column.sortable }} onFocus={props.onFocus}>
        <div class="label">{props.column.label}</div>
      </th>
    )
  },
})
