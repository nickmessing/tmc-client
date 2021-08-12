/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/': {
    get: operations['AppController_getHello']
  }
  '/users/authenticate': {
    get: operations['UsersController_me']
  }
  '/users': {
    get: operations['UsersController_find']
  }
  '/users/{id}': {
    get: operations['UsersController_findOne']
    delete: operations['UsersController_remove']
    patch: operations['UsersController_update']
  }
  '/permissions': {
    get: operations['PermissionsController_findAll']
    post: operations['PermissionsController_create']
  }
  '/permissions/{id}': {
    delete: operations['PermissionsController_remove']
    patch: operations['PermissionsController_update']
  }
  '/roles': {
    get: operations['RolesController_findAll']
    post: operations['RolesController_create']
  }
  '/roles/{id}': {
    get: operations['RolesController_findOne']
    delete: operations['RolesController_remove']
    patch: operations['RolesController_update']
  }
  '/loads': {
    get: operations['LoadsController_findAll']
    post: operations['LoadsController_create']
  }
  '/loads/{id}': {
    get: operations['LoadsController_findOne']
    delete: operations['LoadsController_remove']
    patch: operations['LoadsController_update']
  }
  '/drivers': {
    get: operations['DriversController_findAll']
    post: operations['DriversController_create']
  }
  '/drivers/{id}': {
    get: operations['DriversController_findOne']
    delete: operations['DriversController_remove']
    patch: operations['DriversController_update']
  }
}

export interface components {
  schemas: {
    User: {
      id: string
      createdAt: string
      updatedAt: string
      email: string
      name: string
      roleId: string
    }
    Role: {
      id: string
      createdAt: string
      updatedAt: string
      label: string
      default: boolean
    }
    PermissionAction: 'Manage' | 'Read'
    PermissionModel: 'Drivers' | 'Loads' | 'Roles' | 'Users'
    PermissionValue: 'Any' | 'Own' | 'None'
    Permission: {
      id: string
      createdAt: string
      updatedAt: string
      action: components['schemas']['PermissionAction']
      model: components['schemas']['PermissionModel']
      value: components['schemas']['PermissionValue']
      roleId: string
    }
    AuthenticationResult: {
      user: components['schemas']['User']
      role: components['schemas']['Role']
      permissions: components['schemas']['Permission'][]
    }
    JwtToken: {
      token: string
      data: components['schemas']['AuthenticationResult']
    }
    PaginatedUser: {
      data: components['schemas']['User'][]
      total: number
    }
    UpdateUserDto: {
      roleId: string
    }
    CreatePermissionDto: {
      action: components['schemas']['PermissionAction']
      model: components['schemas']['PermissionModel']
      value: components['schemas']['PermissionValue']
    }
    CreatePermissionsDto: {
      roleId: string
      permissions: components['schemas']['CreatePermissionDto'][]
    }
    UpdatePermissionDto: {
      action?: components['schemas']['PermissionAction']
      model?: components['schemas']['PermissionModel']
      value?: components['schemas']['PermissionValue']
    }
    CreateRoleDto: {
      label: string
      default?: boolean
    }
    UpdateRoleDto: {
      label?: string
      default?: boolean
    }
    CreateLoadDto: { [key: string]: unknown }
    UpdateLoadDto: { [key: string]: unknown }
    CreateDriverDto: { [key: string]: unknown }
    UpdateDriverDto: { [key: string]: unknown }
  }
}

export interface operations {
  AppController_getHello: {
    parameters: {}
    responses: {
      /** Wellcome to anyone who opens the URL manually */
      200: {
        content: {
          'application/json': string
        }
      }
    }
  }
  UsersController_me: {
    parameters: {}
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['JwtToken']
        }
      }
    }
  }
  UsersController_find: {
    parameters: {
      query: {
        page: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['PaginatedUser']
        }
      }
    }
  }
  UsersController_findOne: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['User']
        }
      }
    }
  }
  UsersController_remove: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['User']
        }
      }
    }
  }
  UsersController_update: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['User']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateUserDto']
      }
    }
  }
  PermissionsController_findAll: {
    parameters: {}
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Permission'][]
        }
      }
    }
  }
  PermissionsController_create: {
    parameters: {}
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['Permission'][]
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreatePermissionsDto']
      }
    }
  }
  PermissionsController_remove: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Permission']
        }
      }
    }
  }
  PermissionsController_update: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Permission']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdatePermissionDto']
      }
    }
  }
  RolesController_findAll: {
    parameters: {}
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Role'][]
        }
      }
    }
  }
  RolesController_create: {
    parameters: {}
    responses: {
      201: {
        content: {
          'application/json': components['schemas']['Role']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateRoleDto']
      }
    }
  }
  RolesController_findOne: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Role']
        }
      }
    }
  }
  RolesController_remove: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Role']
        }
      }
    }
  }
  RolesController_update: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: {
        content: {
          'application/json': components['schemas']['Role']
        }
      }
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateRoleDto']
      }
    }
  }
  LoadsController_findAll: {
    parameters: {}
    responses: {
      200: unknown
    }
  }
  LoadsController_create: {
    parameters: {}
    responses: {
      201: unknown
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateLoadDto']
      }
    }
  }
  LoadsController_findOne: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
  }
  LoadsController_remove: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
  }
  LoadsController_update: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateLoadDto']
      }
    }
  }
  DriversController_findAll: {
    parameters: {}
    responses: {
      200: unknown
    }
  }
  DriversController_create: {
    parameters: {}
    responses: {
      201: unknown
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateDriverDto']
      }
    }
  }
  DriversController_findOne: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
  }
  DriversController_remove: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
  }
  DriversController_update: {
    parameters: {
      path: {
        id: string
      }
    }
    responses: {
      200: unknown
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateDriverDto']
      }
    }
  }
}

export interface external {}