import { computed, defineComponent } from 'vue'
import { createTable, TableColumn } from '@/components/common/data-table/Table'
import { DateTime } from 'luxon'

export interface TableRow {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
}

const Table = createTable<TableRow>()

export const UsersTableView = defineComponent({
  name: 'UsersTableView',
  setup() {
    const rows = computed<TableRow[]>(() => [])

    const columns = computed<TableColumn<TableRow>[]>(() => [
      {
        key: 'id',
        label: 'Full Name',
      },
      {
        key: 'id',
        label: 'Email',
      },
      {
        key: 'id',
        label: 'Role',
      },
    ])

    return () => (
      <div class="relative w-full h-full">
        <Table rows={rows.value} columns={columns.value} />
      </div>
    )
  },
})
