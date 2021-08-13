import { computed, defineComponent } from 'vue'
import { createTable, TableColumn } from '@/components/common/data-table/Table'
import { DateTime } from 'luxon'
import { useUsers } from '@/api/modules/users'
import { useRoles } from '@/api/modules/roles'
import { RoleRenderer } from '@/components/common/data-table/renderers/RoleRenderer'

export interface TableRow {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
  name: string
  email: string
  roleId: string
  roleName: string
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
        roleName: allRoles.data.value.find(role => role.id === user.roleId)?.label ?? '',
      })),
    )

    const columns = computed<TableColumn<TableRow>[]>(() => [
      {
        key: 'name',
        label: 'Full Name',
        filterable: true,
        filter: (row, filter) => row.name.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'email',
        label: 'Email',
        filterable: true,
        filter: (row, filter) => row.email.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'roleId',
        label: 'Role',
        renderer: RoleRenderer,
        filterable: true,
        filter: (row, filter) => row.roleName.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
    ])

    return () => (
      <div class="relative w-full h-full">
        <Table rows={rows.value} columns={columns.value} />
      </div>
    )
  },
})
