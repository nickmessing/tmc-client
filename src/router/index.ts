import { Index } from '@/views/Index'
import { RoleIndexView } from '@/views/roles/Index'
import { RoleTableView } from '@/views/roles/Table'
import { UsersIndexView } from '@/views/users/Index'
import { UsersTableView } from '@/views/users/Table'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/roles',
    name: 'Roles',
    component: RoleIndexView,
    children: [
      {
        path: '',
        name: 'RolesList',
        component: RoleTableView,
      },
    ],
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersIndexView,
    children: [
      {
        path: '',
        name: 'RolesList',
        component: UsersTableView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
