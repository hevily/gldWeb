// // eslint-disable-next-line
// import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

// export const asyncRouterMap2 = [

//   {
//     path: '/',
//     name: 'index',
//     component: BasicLayout,
//     meta: { title: '首页' },
//     redirect: '/dashboard/workplace',
//     children: [
//       // dashboard
//       {
//         path: '/dashboard',
//         name: 'dashboard',
//         redirect: '/dashboard/workplace',
//         component: RouteView,
//         meta: { title: '仪表盘', icon: 'dashboard', permission: ['dashboard'] },
//         children: [
//           {
//             path: '/dashboard/analysis',
//             name: 'Analysis',
//             component: () => import('@/views/dashboard/Analysis'),
//             meta: { title: '分析页', permission: ['dashboard'] }
//           },
//           {
//             path: '/dashboard/monitor',
//             name: 'Monitor',
//             hidden: true,
//             component: () => import('@/views/dashboard/Monitor'),
//             meta: { title: '监控页', permission: ['dashboard'] }
//           },
//           {
//             path: '/dashboard/workplace',
//             name: 'Workplace',
//             component: () => import('@/views/dashboard/Workplace'),
//             meta: { title: '工作台', permission: ['dashboard'] }
//           }
//         ]
//       },

//       // forms
//       {
//         path: '/form',
//         name: 'form',
//         redirect: '/form/basic-form',
//         component: PageView,
//         meta: { title: '表单页', icon: 'form', permission: ['form'] },
//         children: [
//           {
//             path: '/form/base-form',
//             name: 'BaseForm',
//             component: () => import('@/views/form/BasicForm'),
//             meta: { title: '基础表单', permission: ['form'] }
//           },
//           {
//             path: '/form/step-form',
//             name: 'StepForm',
//             component: () => import('@/views/form/stepForm/StepForm'),
//             meta: { title: '分步表单', permission: ['form'] }
//           },
//           {
//             path: '/form/advanced-form',
//             name: 'AdvanceForm',
//             component: () => import('@/views/form/advancedForm/AdvancedForm'),
//             meta: { title: '高级表单', permission: ['form'] }
//           }
//         ]
//       },

//       // list
//       {
//         path: '/list',
//         name: 'list',
//         component: PageView,
//         redirect: '/list/query-list',
//         meta: { title: '列表页', icon: 'table', permission: ['table'] },
//         children: [
//           {
//             path: '/list/query-list',
//             name: 'QueryList',
//             component: () => import('@/views/list/TableList'),
//             meta: { title: '查询表格', permission: ['table'] }
//           },
//           {
//             path: '/list/edit-table',
//             name: 'EditList',
//             component: () => import('@/views/list/TableInnerEditList'),
//             meta: { title: '内联编辑表格', permission: ['table'] }
//           },
//           {
//             path: '/list/user-list',
//             name: 'UserList',
//             component: () => import('@/views/list/UserList'),
//             meta: { title: '用户列表', permission: ['table'] }
//           },
//           {
//             path: '/list/role-list',
//             name: 'RoleList',
//             component: () => import('@/views/list/RoleList'),
//             meta: { title: '角色列表', permission: ['table'] }
//           },
//           {
//             path: '/list/system-role',
//             name: 'SystemRole',
//             component: () => import('@/views/role/RoleList'),
//             meta: { title: '角色列表2', permission: ['table'] }
//           },
//           {
//             path: '/list/permission-list',
//             name: 'PermissionList',
//             component: () => import('@/views/list/PermissionList'),
//             meta: { title: '权限列表', permission: ['table'] }
//           },
//           {
//             path: '/list/basic-list',
//             name: 'BasicList',
//             component: () => import('@/views/list/StandardList'),
//             meta: { title: '标准列表', permission: ['table'] }
//           },
//           {
//             path: '/list/card',
//             name: 'CardList',
//             component: () => import('@/views/list/CardList'),
//             meta: { title: '卡片列表', permission: ['table'] }
//           },
//           {
//             path: '/list/search',
//             name: 'SearchList',
//             component: () => import('@/views/list/search/SearchLayout'),
//             redirect: '/list/search/article',
//             meta: { title: '搜索列表', permission: ['table'] },
//             children: [
//               {
//                 path: '/list/search/article',
//                 name: 'SearchArticles',
//                 component: () => import('../views/list/TableList'),
//                 meta: { title: '搜索列表（文章）', permission: ['table'] }
//               },
//               {
//                 path: '/list/search/project',
//                 name: 'SearchProjects',
//                 component: () => import('../views/list/TableList'),
//                 meta: { title: '搜索列表（项目）', permission: ['table'] }
//               },
//               {
//                 path: '/list/search/application',
//                 name: 'SearchApplications',
//                 component: () => import('../views/list/TableList'),
//                 meta: { title: '搜索列表（应用）', permission: ['table'] }
//               },
//             ]
//           },
//         ]
//       },

//       // profile
//       {
//         path: '/profile',
//         name: 'profile',
//         component: RouteView,
//         redirect: '/profile/basic',
//         meta: { title: '详情页', icon: 'profile', permission: ['profile'] },
//         children: [
//           {
//             path: '/profile/basic',
//             name: 'ProfileBasic',
//             component: () => import('@/views/profile/basic/Index'),
//             meta: { title: '基础详情页', permission: ['profile'] }
//           },
//           {
//             path: '/profile/advanced',
//             name: 'ProfileAdvanced',
//             component: () => import('@/views/profile/advanced/Advanced'),
//             meta: { title: '高级详情页', permission: ['profile'] }
//           }
//         ]
//       },

//       // result
//       {
//         path: '/result',
//         name: 'result',
//         component: PageView,
//         redirect: '/result/success',
//         meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
//         children: [
//           {
//             path: '/result/success',
//             name: 'ResultSuccess',
//             component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
//             meta: { title: '成功', hiddenHeaderContent: true, permission: ['result'] }
//           },
//           {
//             path: '/result/fail',
//             name: 'ResultFail',
//             component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
//             meta: { title: '失败', hiddenHeaderContent: true, permission: ['result'] }
//           }
//         ]
//       },

//       // Exception
//       {
//         path: '/exception',
//         name: 'exception',
//         component: RouteView,
//         redirect: '/exception/403',
//         meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
//         children: [
//           {
//             path: '/exception/403',
//             name: 'Exception403',
//             component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
//             meta: { title: '403', permission: ['exception'] }
//           },
//           {
//             path: '/exception/404',
//             name: 'Exception404',
//             component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
//             meta: { title: '404', permission: ['exception'] }
//           },
//           {
//             path: '/exception/500',
//             name: 'Exception500',
//             component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
//             meta: { title: '500', permission: ['exception'] }
//           }
//         ]
//       },

//       // account
//       {
//         path: '/account',
//         component: RouteView,
//         name: 'account',
//         meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
//         children: [
//           {
//             path: '/account/center',
//             name: 'center',
//             component: () => import('@/views/account/center/Index'),
//             meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
//           },
//           {
//             path: '/account/settings',
//             name: 'settings',
//             component: () => import('@/views/account/settings/Index'),
//             meta: { title: '个人设置', hideHeader: true, keepAlive: true, permission: ['user'] },
//             redirect: '/account/settings/base',
//             alwaysShow: true,
//             children: [
//               {
//                 path: '/account/settings/base',
//                 name: 'BaseSettings',
//                 component: () => import('@/views/account/settings/BaseSetting'),
//                 meta: { title: '基本设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/security',
//                 name: 'SecuritySettings',
//                 component: () => import('@/views/account/settings/Security'),
//                 meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/custom',
//                 name: 'CustomSettings',
//                 component: () => import('@/views/account/settings/Custom'),
//                 meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/binding',
//                 name: 'BindingSettings',
//                 component: () => import('@/views/account/settings/Binding'),
//                 meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/notification',
//                 name: 'NotificationSettings',
//                 component: () => import('@/views/account/settings/Notification'),
//                 meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//             ]
//           },
//         ]
//       }
//     ]
//   },
//   {
//     path: '*', redirect: '/404', hidden: true
//   }
// ]




// export const asyncRouterMap = [

//   {
//     path: '/',
//     name: 'index',
//     component: BasicLayout,
//     meta: { title: '首页' },
//     redirect: '/home',
//     children: [
//       // dashboard
//       {
//         path: '/home',
//         name: 'home',
//         component: RouteView,
//         meta: { title: '首页', icon: 'none', permission: ['dashboard'] },
        
//       },

//       {
//         path: '/home/help',
//         name: 'help',
//         hidden: true,
//         component: RouteView,
//         meta: { title: '帮助', icon: 'none', permission: ['dashboard'] }
//       },

//       // forms
//       {
//         path: '/contract',
//         name: 'contract',
//         component: () => import('@/views/contract/index'),
//         meta: { title: '合同', icon: 'none', permission: ['dashboard'] },

//       },

//       {
//         path: '/project',
//         name: 'project',
//         component: () => import('@/views/project/index'),
//         meta: { title: '项目', icon: 'none', permission: ['dashboard'] },

//       },

//       {
//         path: '/task',
//         name: 'task',
//         component: () => import('@/views/task/index'),
//         meta: { title: '任务', icon: 'none', permission: ['dashboard'] },

//       },

//       {
//         path: '/journal',
//         name: 'journal',
//         component: PageView,
//         meta: { title: '日志', icon: 'none', permission: ['dashboard'] },

//       },
//       {
//         path: '/doc',
//         name: 'doc',
//         component: () => import('@/views/document/index'),
//         meta: { title: '文档', icon: 'none', permission: ['dashboard'] },

//       },

//       {
//         path: '/report',
//         name: 'report',
//         component: PageView,
//         meta: { title: '报表', icon: 'none', permission: ['dashboard'] },

//       },




//       // account
//       {
//         path: '/account',
//         component: RouteView,
//         name: 'account',
//         meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
//         hidden: true,
//         children: [
//           {
//             path: '/account/center',
//             name: 'center',
//             component: () => import('@/views/account/center/Index'),
//             meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
//           },
//           {
//             path: '/account/settings',
//             name: 'settings',
//             component: () => import('@/views/account/settings/Index'),
//             meta: { title: '个人设置', hideHeader: true, keepAlive: true, permission: ['user'] },
//             redirect: '/account/settings/base',
//             alwaysShow: true,
//             children: [
//               {
//                 path: '/account/settings/base',
//                 name: 'BaseSettings',
//                 component: () => import('@/views/account/settings/BaseSetting'),
//                 meta: { title: '基本设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/security',
//                 name: 'SecuritySettings',
//                 component: () => import('@/views/account/settings/Security'),
//                 meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/custom',
//                 name: 'CustomSettings',
//                 component: () => import('@/views/account/settings/Custom'),
//                 meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/binding',
//                 name: 'BindingSettings',
//                 component: () => import('@/views/account/settings/Binding'),
//                 meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//               {
//                 path: '/account/settings/notification',
//                 name: 'NotificationSettings',
//                 component: () => import('@/views/account/settings/Notification'),
//                 meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['user'] }
//               },
//             ]
//           },
//         ]
//       }
//     ]
//   },
//   {
//     path: '*', redirect: '/404', hidden: true
//   }
// ]
// /**
//  * 基础路由
//  * @type { *[] }
//  */
// export const constantRouterMap = [
//   {
//     path: '/user',
//     component: UserLayout,
//     redirect: '/user/login',
//     hidden: true,
//     children: [
//       {
//         path: 'login',
//         name: 'login',
//         component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
//       },
//       {
//         path: 'register',
//         name: 'register',
//         component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
//       },
//       {
//         path: 'register-result',
//         name: 'registerResult',
//         component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
//       }
//     ]
//   },

//   {
//     path: '/test',
//     component: BlankLayout,
//     redirect: '/test/home',
//     children: [
//       {
//         path: 'home',
//         name: 'TestHome',
//         component: () => import('@/views/Home')
//       }
//     ]
//   },

//   {
//     path: '/404',
//     component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
//   },

// ]



// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

export const asyncRouterMap2 = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', icon: 'dashboard', permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', permission: ['dashboard'] }
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: { title: '监控页', permission: ['dashboard'] }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', permission: ['dashboard'] }
          }
        ]
      },

      // forms
      {
        path: '/form',
        name: 'form',
        redirect: '/form/basic-form',
        component: PageView,
        meta: { title: '表单页', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/BasicForm'),
            meta: { title: '基础表单', permission: ['form'] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: '分步表单', permission: ['form'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: '高级表单', permission: ['form'] }
          }
        ]
      },

      // list
      {
        path: '/list',
        name: 'list',
        component: PageView,
        redirect: '/list/query-list',
        meta: { title: '列表页', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/query-list',
            name: 'QueryList',
            component: () => import('@/views/list/TableList'),
            meta: { title: '查询表格', permission: ['table'] }
          },
          {
            path: '/list/edit-table',
            name: 'EditList',
            component: () => import('@/views/list/TableInnerEditList'),
            meta: { title: '内联编辑表格', permission: ['table'] }
          },
          {
            path: '/list/user-list',
            name: 'UserList',
            component: () => import('@/views/list/UserList'),
            meta: { title: '用户列表', permission: ['table'] }
          },
          {
            path: '/list/role-list',
            name: 'RoleList',
            component: () => import('@/views/list/RoleList'),
            meta: { title: '角色列表', permission: ['table'] }
          },
          {
            path: '/list/system-role',
            name: 'SystemRole',
            component: () => import('@/views/role/RoleList'),
            meta: { title: '角色列表2', permission: ['table'] }
          },
          {
            path: '/list/permission-list',
            name: 'PermissionList',
            component: () => import('@/views/list/PermissionList'),
            meta: { title: '权限列表', permission: ['table'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/StandardList'),
            meta: { title: '标准列表', permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: '卡片列表', permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: '搜索列表', permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('../views/list/TableList'),
                meta: { title: '搜索列表（文章）', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('../views/list/TableList'),
                meta: { title: '搜索列表（项目）', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('../views/list/TableList'),
                meta: { title: '搜索列表（应用）', permission: ['table'] }
              },
            ]
          },
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: '详情页', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/Index'),
            meta: { title: '基础详情页', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: '高级详情页', permission: ['profile'] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, keepAlive: true, permission: ['user'] },
            redirect: '/account/settings/base',
            alwaysShow: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Role'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: ['user'] }
              },
            ]
          },
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页', icon: 'none' },
    redirect: '/contract',
    children: [
      // dashboard
      {
        path: '/home',
        name: 'home',
        component: RouteView,
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'none' },
        // redirect: '/contract',
      },
      

      {
        path: '/home/help',
        name: 'help',
        hidden: true,
        component: RouteView,
        meta: { title: '帮助', icon: 'none' }
      },
      {
        path: '/notification',
        name: 'notification',
        hidden: true,
        component: () => import('@/views/notification/index'),
        meta: { title: '消息提醒', icon: 'none' }
      },
      // forms
      {
        path: '/contract',
        name: 'contract',
        component: () => import('@/views/contract/index'),
        meta: { title: '合同', icon: 'none', permission: ['contract'] },

      },

      {
        path: '/project',
        name: 'project',
        component: () => import('@/views/project/index'),
        meta: { title: '项目', icon: 'none', permission: ['project'] },

      },

      {
        path: '/task',
        name: 'task',
        component: () => import('@/views/task/index'),
        meta: { title: '任务', icon: 'none', permission: ['project'] },

      },

      // {
      //   path: '/journal',
      //   name: 'journal',
      //   component: PageView,
      //   meta: { title: '日志', icon: 'none' },

      // },
      {
        path: '/doc',
        name: 'doc',
        component: () => import('@/views/document/index'),
        meta: { title: '文档', icon: 'none', permission: ['document'] },

      },

      {
        path: '/report',
        name: 'report',
        // component: PageView,
        component: () => import('@/views/report/Summary'),
        meta: { title: '报表', icon: 'none', permission: ['report'] },
        // redirect: '/report/sumamry',
        alwaysShow: true,
        children: [
          {
            path: '/report/summary',
            name: 'ProjectSummary',
            component: () => import('@/views/report/Summary'),
            meta: { title: '项目汇总', hideHeader: true, keepAlive: true }
          },
          {
            path: '/report/performance',
            name: 'ProjectPerformance',
            component: () => import('@/views/report/ProjectPerformance'),
            meta: { title: '个人绩效', hideHeader: true, hidden: true, keepAlive: true }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true },
        hidden: true,
        children: [
          // {
          //   path: '/account/center',
          //   name: 'center',
          //   component: () => import('@/views/account/center/Index'),
          //   meta: { title: '个人中心', hideHeader: true, keepAlive: true }
          // },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '系统设置', hideHeader: true, keepAlive: true },
            redirect: '/account/settings/depart',
            alwaysShow: true,
            children: [
              // {
              //   path: '/account/settings/base',
              //   name: 'BaseSettings',
              //   component: () => import('@/views/account/settings/BaseSetting'),
              //   meta: { title: '企业信息', hideHeader: true, hidden: true, keepAlive: true, permission: ['company'] }
              // },
              {
                path: '/account/settings/depart',
                name: 'DepartSettings',
                component: () => import('@/views/account/settings/Depart'),
                meta: { title: '组织架构', hideHeader: true, hidden: true, keepAlive: true, permission: ['department'] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Role'),
                meta: { title: '角色管理', hideHeader: true, hidden: true, keepAlive: true, permission: ['role']}
              },
              // {
              //   path: '/account/settings/binding',
              //   name: 'BindingSettings',
              //   component: () => import('@/views/account/settings/Binding'),
              //   meta: { title: '编码管理', hideHeader: true, hidden: true, keepAlive: true, permission: ['code'] }
              // }
            ]
          },
        ]
      }
    ]
  },
  {
    path: '/workplace',
    name: 'workplace',
    component: () => import('@/views/dashboard/Workplace')
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
