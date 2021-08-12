import { PermissionAction } from '@/api/generated/enums/PermissionAction'
import { PermissionModel } from '@/api/generated/enums/PermissionModel'
import { PermissionValue } from '@/api/generated/enums/PermissionValue'
import { usePermissions } from '@/api/modules/permissions'
import { useRoles } from '@/api/modules/roles'
import { computed, defineComponent } from 'vue'
import { CheckboxEditor } from '@/components/common/data-table/editors/CheckboxEditor'
import { CheckboxRenderer } from '@/components/common/data-table/renderers/CheckboxRenderer'
import { PermissionEditor } from '@/components/common/data-table/editors/PermissionEditor'
import { createTable, TableColumn } from '@/components/common/data-table/Table'
import { DateTime } from 'luxon'
import { DefaultFilter } from '@/components/common/data-table/filters/DefaultFilter'
import { PermissionsFilter } from '@/components/common/data-table/filters/PermissionsFilter'

export interface TableRow {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
  roleLabel: string
  roleDefault: boolean
  readLoads: PermissionValue
  readDrivers: PermissionValue
  readUsers: PermissionValue
  readRoles: PermissionValue
  manageLoads: PermissionValue
  manageDrivers: PermissionValue
  manageUsers: PermissionValue
  manageRoles: PermissionValue
}

const Table = createTable<TableRow>()

export const RoleTableView = defineComponent({
  name: 'RoleTableView',
  setup() {
    const roles = useRoles()
    const permissions = usePermissions()
    const all = roles.all()
    const allPermissions = permissions.all()

    const getPermission = (id: string, model: PermissionModel, action: PermissionAction) =>
      allPermissions.data.value.find(
        permission => permission.roleId === id && permission.model === model && permission.action === action,
      )
    const getPermissionValue = (id: string, model: PermissionModel, action: PermissionAction) =>
      getPermission(id, model, action)?.value ?? PermissionValue.None
    const setPermission =
      (model: PermissionModel, action: PermissionAction) => async (row: TableRow, val: PermissionValue) => {
        const permission = getPermission(row.id, model, action)
        if (permission != null) {
          permissions.update(permission.id, { value: val })
        } else {
          permissions.create({
            roleId: row.id,
            permissions: [
              {
                action,
                model,
                value: val,
              },
            ],
          })
        }
      }

    const rows = computed<TableRow[]>(() =>
      all.data.value.map(role => ({
        id: role.id,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        roleLabel: role.label,
        roleDefault: role.default,
        readLoads: getPermissionValue(role.id, PermissionModel.Loads, PermissionAction.Read),
        readDrivers: getPermissionValue(role.id, PermissionModel.Drivers, PermissionAction.Read),
        readUsers: getPermissionValue(role.id, PermissionModel.Users, PermissionAction.Read),
        readRoles: getPermissionValue(role.id, PermissionModel.Roles, PermissionAction.Read),
        manageLoads: getPermissionValue(role.id, PermissionModel.Loads, PermissionAction.Manage),
        manageDrivers: getPermissionValue(role.id, PermissionModel.Drivers, PermissionAction.Manage),
        manageUsers: getPermissionValue(role.id, PermissionModel.Users, PermissionAction.Manage),
        manageRoles: getPermissionValue(role.id, PermissionModel.Roles, PermissionAction.Manage),
      })),
    )

    const columns = computed<TableColumn<TableRow>[]>(() => [
      {
        key: 'roleDefault',
        label: 'Default',
        editable: true,
        renderer: CheckboxRenderer,
        editorRenderer: CheckboxEditor,
        async save(row, val) {
          await roles.update(row.id, { default: val })
          all.fetch()
        },
        filterable: true,
        filterRenderer: DefaultFilter,
        filter: (row, filter) =>
          (filter as string[]).length === 0 || (filter as string[]).includes(String(Boolean(row.roleDefault))),
        sortable: true,
        comparator: (a, b) => (a.roleDefault ? -1 : b.roleDefault ? 1 : 0),
      },
      {
        key: 'roleLabel',
        label: 'Name',
        editable: true,
        async save(row, val) {
          await roles.update(row.id, { label: val })
        },
        filterable: true,
        filter: (row, filter) => {
          return row.roleLabel.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase())
        },
        sortable: true,
        comparator: (a, b) => a.roleLabel.localeCompare(b.roleLabel),
      },
      {
        key: 'readLoads',
        label: 'Read Loads',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Loads, PermissionAction.Read),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.readLoads),
        sortable: true,
        comparator: (a, b) => a.readLoads.localeCompare(b.readLoads),
      },
      {
        key: 'manageLoads',
        label: 'Manage Loads',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Loads, PermissionAction.Manage),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.manageLoads),
        sortable: true,
        comparator: (a, b) => a.manageLoads.localeCompare(b.manageLoads),
      },
      {
        key: 'readDrivers',
        label: 'Read Drivers',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Drivers, PermissionAction.Read),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.readDrivers),
        sortable: true,
        comparator: (a, b) => a.readDrivers.localeCompare(b.readDrivers),
      },
      {
        key: 'manageDrivers',
        label: 'Manage Drivers',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Drivers, PermissionAction.Manage),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.manageDrivers),
        sortable: true,
        comparator: (a, b) => a.manageDrivers.localeCompare(b.manageDrivers),
      },
      {
        key: 'readUsers',
        label: 'Read Users',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Users, PermissionAction.Read),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.readUsers),
        sortable: true,
        comparator: (a, b) => a.readUsers.localeCompare(b.readUsers),
      },
      {
        key: 'manageUsers',
        label: 'Manage Users',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Users, PermissionAction.Manage),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.manageUsers),
        sortable: true,
        comparator: (a, b) => a.manageUsers.localeCompare(b.manageUsers),
      },
      {
        key: 'readRoles',
        label: 'Read Roles',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Roles, PermissionAction.Read),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.readRoles),
        sortable: true,
        comparator: (a, b) => a.readRoles.localeCompare(b.readRoles),
      },
      {
        key: 'manageRoles',
        label: 'Manage Roles',
        editable: true,
        editorRenderer: PermissionEditor,
        save: setPermission(PermissionModel.Roles, PermissionAction.Manage),
        filterable: true,
        filterRenderer: PermissionsFilter,
        filter: (row, filter) =>
          (filter as PermissionValue[]).length === 0 || (filter as PermissionValue[]).includes(row.manageRoles),
        sortable: true,
        comparator: (a, b) => a.manageRoles.localeCompare(b.manageRoles),
      },
    ])

    return () => (
      <div class="relative w-full h-full">
        <Table rows={rows.value} columns={columns.value} />
      </div>
    )
  },
})
