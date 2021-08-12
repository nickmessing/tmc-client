import { defineComponent } from 'vue'
import { RouteLocationRaw, RouterLink } from 'vue-router'
import { Icon, IconName } from '@/components/common/Icon'

export type NavigationLink = {
  to: RouteLocationRaw
  icon: IconName
  name: string
}

export const Navigation = defineComponent({
  name: 'Navigation',
  setup() {
    const links: NavigationLink[] = [
      {
        to: '/drivers',
        icon: 'mdiSteering',
        name: 'Drivers',
      },
      {
        to: '/loads',
        icon: 'mdiTruckTrailer',
        name: 'Loads',
      },
      {
        to: '/users',
        icon: 'mdiAccount',
        name: 'Users',
      },
      {
        to: '/roles',
        icon: 'mdiLock',
        name: 'Roles',
      },
    ]
    return () => (
      <nav class="w-full h-full border-r border-bg2">
        <RouterLink to="/" class="block pl-4 py-8">
          <img src={require('@/assets/logo-horizontal.svg')} class="w-24" />
        </RouterLink>
        {links.map(link => (
          <RouterLink to={link.to} class="nav-link" activeClass="active">
            <Icon name={link.icon} size="20" class="mr-2" />
            <span class="text-sm leading-10">{link.name}</span>
          </RouterLink>
        ))}
      </nav>
    )
  },
})
