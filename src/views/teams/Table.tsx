import { computed, defineComponent, ref } from 'vue'
import { createTable, TableColumn } from '@/components/common/data-table/Table'
import { DateTime } from 'luxon'
import { useTeams } from '@/api/modules/teams'
import { Driver, useDrivers } from '@/api/modules/drivers'
import { CommonKey } from '@/api/generated/enums/CommonKey'
import { DispatcherEditor } from '@/components/common/data-table/editors/DispatcherEditor'
import { DispatcherRenderer } from '@/components/common/data-table/renderers/DispatcherRenderer'
import { useUsers } from '@/api/modules/users'

export interface TableRow {
  id: string
  createdAt: DateTime
  updatedAt: DateTime
  type: 'driver' | 'team'
  name: string
  phone: string
  email: string
  truck: string
  trailer: string
  dispatcherId: string
  dispatcherName: string
  teamId: string
  drivers?: Driver[]
}

const Table = createTable<TableRow>()

export const TeamsDriversTableView = defineComponent({
  name: 'TeamsDriversTableView',
  setup() {
    const teams = useTeams()
    const drivers = useDrivers()
    const users = useUsers()

    const allTeams = teams.all()
    const allDrivers = drivers.all()
    const allUsers = users.all()

    const editField = (key: CommonKey) => async (row: TableRow, value: string) => {
      if (row.type === 'team') {
        const driversList = allDrivers.data.value.filter(driver => driver.teamId === row.id)

        await teams.update(row.id, { key, value })

        if (driversList.length === 1 || key === CommonKey.Truck || key === CommonKey.Trailer) {
          await Promise.all(driversList.map(driver => drivers.update(driver.id, { key, value })))
        }
      } else {
        await drivers.update(row.id, { key, value })

        if (key === CommonKey.Truck || key === CommonKey.Trailer) {
          await teams.update(row.teamId, { key, value })
        }
      }
    }

    const rows = computed<TableRow[]>(() =>
      allTeams.data.value
        .map(team => {
          const drivers = allDrivers.data.value.filter(driver => driver.teamId === team.id)
          const dispatcherName = allUsers.data.value.find(user => user.id === team.dispatcherId)?.name ?? 'None'
          const teamRow = {
            ...team,
            type: 'team' as const,
            drivers,
            dispatcherId: team.dispatcherId ?? '',
            dispatcherName,
            teamId: team.id,
          }
          return expandedRows.value.includes(team.id)
            ? [
                teamRow,
                ...drivers.map(driver => ({
                  ...driver,
                  type: 'driver' as const,
                  dispatcherId: team.dispatcherId ?? '',
                  dispatcherName,
                  teamId: team.id,
                })),
              ]
            : [teamRow]
        })
        .flat(),
    )
    const columns = computed<TableColumn<TableRow>[]>(() => [
      {
        key: 'name',
        label: 'Full Name',
        placeholder: 'Jon Doe',
        editable: true,
        save: editField(CommonKey.Name),
        filterable: true,
        filter: (row, filter) => row.name.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'phone',
        label: 'Phone Number',
        placeholder: 'xxx-xxx-xxxx',
        editable: true,
        save: editField(CommonKey.Phone),
        filterable: true,
        filter: (row, filter) => row.phone.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'truck',
        label: 'Truck#',
        placeholder: 'xxx-xxxx',
        editable: true,
        save: editField(CommonKey.Truck),
        filterable: true,
        filter: (row, filter) => row.truck.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'trailer',
        label: 'Trailer#',
        placeholder: 'xxx-xxxx',
        editable: true,
        save: editField(CommonKey.Trailer),
        filterable: true,
        filter: (row, filter) => row.trailer.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'email',
        label: 'Email',
        placeholder: 'jon@goldcoast-logistics.com',
        editable: true,
        save: editField(CommonKey.Email),
        filterable: true,
        filter: (row, filter) => row.email.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
      {
        key: 'dispatcherId',
        label: 'Dispatcher',
        renderer: DispatcherRenderer,
        editable: true,
        editorRenderer: DispatcherEditor,
        async save(row: TableRow, val: string) {
          const teamId = row.teamId

          await teams.updateDispatcher(teamId, val)
        },
        filterable: true,
        filter: (row, filter) =>
          row.dispatcherName.toLocaleLowerCase().includes((filter as string).toLocaleLowerCase()),
      },
    ])

    const addToTeam = (row: TableRow) => async () => {
      const targetTeamId = focus.value?.id

      if (targetTeamId == null) {
        return
      }

      const targetTeam = allTeams.data.value.find(team => team.id === targetTeamId)
      if (targetTeam == null) {
        return
      }

      if (row.type === 'team') {
        const driversList = row.drivers ?? []
        if (driversList.length !== 1) {
          return
        }

        const existingDrivers = allDrivers.data.value.filter(driver => driver.teamId === targetTeamId)
        if (existingDrivers.length === 1) {
          await teams.update(targetTeamId, {
            key: CommonKey.Name,
            value: `${existingDrivers[0].name.split(' ')[0]} & ${driversList[0].name.split(' ')[0]}`,
          })
        }

        await drivers.updateTeam(driversList[0].id, targetTeamId)
        await drivers.update(driversList[0].id, { key: CommonKey.Trailer, value: targetTeam.trailer })
        await drivers.update(driversList[0].id, { key: CommonKey.Truck, value: targetTeam.truck })
        await teams.remove(row.id)
      } else {
        const driver = allDrivers.data.value.find(driver => driver.id === row.id)
        if (!driver) {
          return
        }
        const oldTeamId = driver.teamId
        if (oldTeamId == null) {
          return
        }
        const existingDrivers = allDrivers.data.value.filter(driver => driver.teamId === targetTeamId)
        if (existingDrivers.length === 1) {
          await teams.update(targetTeamId, {
            key: CommonKey.Name,
            value: `${existingDrivers[0].name.split(' ')[0]} & ${row.name.split(' ')[0]}`,
          })
        }

        await drivers.updateTeam(row.id, targetTeamId)
        await drivers.update(row.id, { key: CommonKey.Trailer, value: targetTeam.trailer })
        await drivers.update(row.id, { key: CommonKey.Truck, value: targetTeam.truck })

        const oldTeamDrivers = allDrivers.data.value.filter(driver => driver.teamId === oldTeamId)
        if (oldTeamDrivers.length === 1) {
          await teams.update(oldTeamId, { key: CommonKey.Name, value: oldTeamDrivers[0].name })
        }

        expandedRows.value = expandedRows.value.filter(id => expandableRows.value.includes(id))
      }
    }

    const removeFromTeam = (row: TableRow) => async () => {
      const team = await teams.create()

      const driver = allDrivers.data.value.find(driver => driver.id === row.id)
      if (!driver) {
        return
      }
      const oldTeamId = driver.teamId
      if (oldTeamId == null) {
        return
      }
      await teams.update(team.id, {
        key: CommonKey.Name,
        value: driver.name,
      })

      await drivers.updateTeam(row.id, team.id)
      await drivers.update(row.id, { key: CommonKey.Trailer, value: '' })
      await drivers.update(row.id, { key: CommonKey.Truck, value: '' })

      const oldTeamDrivers = allDrivers.data.value.filter(driver => driver.teamId === oldTeamId)
      if (oldTeamDrivers.length === 1) {
        await teams.update(oldTeamId, { key: CommonKey.Name, value: oldTeamDrivers[0].name })
      }

      expandedRows.value = expandedRows.value.filter(id => expandableRows.value.includes(id))
    }

    const focus = ref<TableRow | null>(null)

    const expandableRows = computed(() => rows.value.filter(row => (row.drivers?.length ?? 0) > 1).map(row => row.id))
    const expandedRows = ref<string[]>([])

    const toggleExpand = (id: string) =>
      expandedRows.value.includes(id)
        ? (expandedRows.value = expandedRows.value.filter(eId => eId !== id))
        : (expandedRows.value = [...expandedRows.value, id])

    return () => (
      <div class="relative w-full h-full">
        <Table
          rows={rows.value}
          columns={columns.value}
          focusRef={focus}
          contextMenu={row => [
            ...(focus.value &&
            focus.value.type === 'team' &&
            row.id !== focus.value.id &&
            (row.drivers?.length === 1 ||
              (row.type === 'driver' && !focus.value.drivers?.find(driver => driver.id === row.id)))
              ? [{ label: 'Add to selected team', action: addToTeam(row) }]
              : []),
            ...(row.type === 'driver' ? [{ label: 'Remove from Team', action: removeFromTeam(row) }] : []),
          ]}
          expandableRows={expandableRows.value}
          expandedRows={expandedRows.value}
          expandable
          onToggleExpand={toggleExpand}
        />
      </div>
    )
  },
})
