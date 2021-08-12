import { typedProp } from '@/types/props'
import { group, key, prevent, stop } from '@/utils/events'
import { DateTime } from 'luxon'
import { computed, defineComponent, reactive, ref } from 'vue'
import { EditableCell } from './EditableCell'
import { TextEditor } from './editors/TextEditor'
import { FilterCell } from './FilterCell'
import { TextRenderer } from './renderers/TextRenderer'
import { TitleCell } from './TitleCell'

export type TableColumn<T = any> = {
  [K in keyof T]: {
    key: K
    label: string
    renderer?: ReturnType<typeof defineComponent>
  } & (
    | {
        editable?: false
        editorRenderer?: undefined
        save?: undefined
      }
    | {
        editable: true
        editorRenderer?: ReturnType<typeof defineComponent>
        save: (row: T, val: T[K]) => Promise<any>
      }
  ) &
    (
      | {
          sortable?: false
          comparator?: undefined
        }
      | {
          sortable: true
          comparator: (val1: T[K], val2: T[K]) => -1 | 0 | 1
        }
    ) &
    (
      | {
          filterable?: false
          filterRenderer?: undefined
          filter?: undefined
        }
      | {
          filterable: true
          filterRenderer?: ReturnType<typeof defineComponent>
          filter: (row: T, filter: unknown) => boolean
        }
    )
}[keyof T]

export const createTable = <T extends { id: string; createdAt: DateTime; updatedAt: DateTime }>(name?: string) =>
  defineComponent({
    name: name ?? 'DataTable',
    props: {
      columns: {
        type: typedProp<TableColumn<T>[]>(Array),
        required: true,
      },
      rows: {
        type: typedProp<T[]>(Array),
        required: true,
      },
    },
    setup(props) {
      const focusedCell = ref<[number, number]>([0, 0])
      const editing = ref(false)

      const filters = reactive<Record<number, unknown>>({})

      const moveLeft = stop(
        prevent(() => {
          editing.value = false
          focusedCell.value[1] > 0 && (focusedCell.value = [focusedCell.value[0], focusedCell.value[1] - 1])
        }),
      )
      const moveRight = stop(
        prevent(() => {
          editing.value = false
          focusedCell.value[1] < props.columns.length - 1 &&
            (focusedCell.value = [focusedCell.value[0], focusedCell.value[1] + 1])
        }),
      )
      const moveUp = stop(
        prevent(() => {
          editing.value = false
          focusedCell.value[0] > -2 && (focusedCell.value = [focusedCell.value[0] - 1, focusedCell.value[1]])
        }),
      )
      const moveDown = stop(
        prevent(() => {
          editing.value = false
          focusedCell.value[0] < props.rows.length - 1 &&
            (focusedCell.value = [focusedCell.value[0] + 1, focusedCell.value[1]])
        }),
      )

      const edit = stop(prevent(() => (editing.value = true)))

      const filteredRows = computed(() =>
        props.rows.filter(row =>
          props.columns
            .map((column, index) => filters[index] == null || column.filter?.(row, filters[index]))
            .every(el => el),
        ),
      )

      return () => (
        <table
          class="data-table"
          onKeydown={group(
            key('ArrowLeft', moveLeft),
            key('ArrowRight', moveRight),
            key('ArrowUp', moveUp),
            key('ArrowDown', moveDown),
            key('Enter', edit),
          )}
        >
          <thead>
            <tr>
              {props.columns.map((column, index) => (
                <TitleCell
                  column={column as TableColumn}
                  focused={focusedCell.value[0] === -2 && focusedCell.value[1] === index}
                  onFocus={() => {
                    focusedCell.value = [-2, index]
                    editing.value = false
                  }}
                />
              ))}
            </tr>
            <tr>
              {props.columns.map((column, index) => (
                <FilterCell
                  value={filters[index]}
                  focused={focusedCell.value[0] === -1 && focusedCell.value[1] === index}
                  editing={focusedCell.value[0] === -1 && focusedCell.value[1] === index && editing.value}
                  editor={column.filterable ? column.filterRenderer ?? TextEditor : undefined}
                  onInput={val => (filters[index] = val)}
                  onFocus={() => {
                    focusedCell.value = [-1, index]
                    editing.value = false
                  }}
                  onEdit={() => {
                    focusedCell.value = [-1, index]
                    editing.value = true
                  }}
                  onCancel={() => (editing.value = false)}
                  onClear={() => {
                    editing.value = false
                    delete filters[index]
                  }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.value.map((row, rIndex) => (
              <tr>
                {props.columns.map((column, cIndex) => (
                  <EditableCell
                    value={row[column.key]}
                    renderer={column.renderer ?? TextRenderer}
                    editor={column.editorRenderer ?? TextEditor}
                    editable={Boolean(column.editable)}
                    editing={focusedCell.value[0] === rIndex && focusedCell.value[1] === cIndex && editing.value}
                    focused={focusedCell.value[0] === rIndex && focusedCell.value[1] === cIndex}
                    onUpdate={async val => {
                      editing.value = false
                      return column.save?.(row, val as T[keyof T])
                    }}
                    onFocus={() => {
                      focusedCell.value = [rIndex, cIndex]
                      editing.value = false
                    }}
                    onCancel={() => (editing.value = false)}
                    onEdit={() => {
                      focusedCell.value = [rIndex, cIndex]
                      editing.value = true
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    },
  })