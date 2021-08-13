import { computed, defineComponent } from 'vue'
import { createTable, TableColumn } from '@/components/common/data-table/Table'
import { DateTime } from 'luxon'
import { useUsers } from '@/api/modules/users'
import { Role, useRoles } from '@/api/modules/roles'
import { RoleRenderer } from '@/components/common/data-table/renderers/RoleRenderer'

export interface TableRow {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
  name: string
  email: string
  roleId: string
  role: Role | null
}

const Table = createTable<TableRow>()

export const UsersTableView = defineComponent({
  name: 'UsersTableView',
  setup() {
    const users = useUsers()
    const roles = useRoles()
    const all = users.all()
    const allRoles = roles.all()

    const rows = computed<TableRow[]>(() =>
      all.data.value.map(user => ({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        role: allRoles.data.value.find(role => role.id === user.roleId) ?? null,
      })),
    )

    const columns = computed<TableColumn<TableRow>[]>(() => [
      {
        key: 'name',
        label: 'Full Name',
        filterable: true,
        filter: (row, filter) => row.name.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
        sortable: true,
        comparator: (a, b) => a.name.localeCompare(b.name),
      },
      {
        key: 'email',
        label: 'Email',
        filterable: true,
        filter: (row, filter) => row.email.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
        sortable: true,
        comparator: (a, b) => a.email.localeCompare(b.email),
      },
      {
        key: 'role',
        label: 'Role',
        renderer: RoleRenderer,
        filterable: true,
        filter: (row, filter) =>
          row.role?.label.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()) ?? true,
        sortable: true,
        comparator: (a, b) => (a.role?.label ?? '').localeCompare(b.role?.label ?? ''),
      },
    ])

    return () => (
      <div class="relative w-full h-full">
        <Table rows={rows.value} columns={columns.value} />
      </div>
    )
  },
})
