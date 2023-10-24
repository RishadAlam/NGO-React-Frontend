import { getRecoil } from 'recoil-nexus'
import { authDataState } from '../../atoms/authAtoms'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'

export const mainMenu = (t) => {
  const { permissions } = getRecoil(authDataState)

  return {
    [t('menu.categories.Basic')]: [
      {
        id: 1,
        label: t('menu.label.registration'),
        path: '',
        icon: 'UserPlus',
        view: checkPermissions([], permissions),
        subMenu: [
          {
            id: 'reg1',
            label: 'Client Registration',
            path: '/client-registration',
            icon: 'UserPlus',
            view: checkPermission('', permissions)
          },
          {
            id: 'reg2',
            label: 'Create Saving Account',
            path: '/create-saving-account',
            icon: 'UserPlus',
            view: checkPermission('', permissions)
          },
          {
            id: 'reg3',
            label: 'Create Loan Account',
            path: '/create-loan-account',
            icon: 'UserPlus',
            view: checkPermission('', permissions)
          }
        ]
      }
    ],
    [t('menu.categories.Control_Panel')]: [
      {
        id: 1,
        label: t('menu.label.field'),
        path: '/fields',
        icon: 'Globe',
        view: checkPermission('field_list_view', permissions)
      },
      {
        id: 2,
        label: t('menu.label.center'),
        path: '/centers',
        icon: 'Chrome',
        view: checkPermission('center_list_view', permissions)
      },
      {
        id: 3,
        label: t('menu.label.category'),
        path: '/categories',
        icon: 'Command',
        view: checkPermission('category_list_view', permissions)
      },
      {
        id: 4,
        label: t('menu.label.account_management'),
        path: '',
        icon: 'Shield',
        view: checkPermissions(['account_list_view'], permissions),
        subMenu: [
          {
            id: 'acc1',
            label: t('menu.account_management.Accounts'),
            path: '/accounts',
            icon: 'Dollar',
            view: checkPermission('account_list_view', permissions)
          },
          {
            id: 'acc2',
            label: t('menu.account_management.Income'),
            path: '/accounts/income',
            icon: 'Dollar',
            view: checkPermission('income_list_view', permissions)
          },
          {
            id: 'acc3',
            label: t('menu.account_management.Expense'),
            path: '/accounts/expense',
            icon: 'Dollar',
            view: checkPermission('expense_list_view', permissions)
          },
          {
            id: 'acc4',
            label: t('menu.account_management.Income_Categories'),
            path: '/accounts/income/categories',
            icon: 'Dollar',
            view: checkPermission('income_category_list_view', permissions)
          },
          {
            id: 'acc5',
            label: t('menu.account_management.Expense_Categories'),
            path: '/accounts/expense/categories',
            icon: 'Dollar',
            view: checkPermission('expense_category_list_view', permissions)
          }
        ]
      },
      {
        id: 5,
        label: t('menu.label.staff'),
        path: '',
        icon: 'Users',
        view: checkPermissions(['staff_list_view', 'role_list_view'], permissions),
        subMenu: [
          {
            id: 'staff1',
            label: t('menu.staffs.Staffs'),
            path: '/staffs',
            icon: 'Users',
            view: checkPermission('staff_list_view', permissions)
          },
          {
            id: 'staff2',
            label: t('menu.staffs.Staff_Roles'),
            path: '/staff-roles',
            icon: 'UserCheck',
            view: checkPermission('role_list_view', permissions)
          }
        ]
      },
      {
        id: 6,
        label: t('menu.label.settings_and_privacy'),
        path: '',
        icon: 'Settings',
        view: checkPermissions(['app_settings', 'approvals_config'], permissions),
        subMenu: [
          {
            id: 'config1',
            label: t('menu.settings_and_privacy.app_settings'),
            path: '/settings-and-privacy',
            icon: 'Tool',
            view: checkPermission('app_settings', permissions)
          },
          {
            id: 'config2',
            label: t('menu.settings_and_privacy.approvals_config'),
            path: '/settings-and-privacy/approvals',
            icon: 'Tool',
            view: checkPermission('approvals_config', permissions)
          },
          {
            id: 'config3',
            label: t('menu.settings_and_privacy.categories_config'),
            path: '/settings-and-privacy/categories-config',
            icon: 'Tool',
            view: checkPermission('categories_config', permissions)
          }
        ]
      }
    ]
  }
}
