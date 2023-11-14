import { getRecoil } from 'recoil-nexus'
import { appApprovalConfigsState } from '../../atoms/appApprovalConfigAtoms'
import { authDataState } from '../../atoms/authAtoms'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'

export const mainMenu = (t) => {
  const { permissions } = getRecoil(authDataState)
  const approvals = getRecoil(appApprovalConfigsState)

  let client_registration_approval = true

  Array.isArray(approvals) &&
    approvals.forEach((approval) => {
      if (approval.meta_key === 'client_registration_approval') {
        client_registration_approval = approval.meta_value
      }
    })

  return {
    [t('menu.categories.Basic')]: [
      {
        id: 1,
        label: t('menu.label.registration'),
        path: '',
        icon: 'UserPlus',
        view: checkPermissions(['client_registration'], permissions),
        subMenu: [
          {
            id: 'reg1',
            label: t('menu.registration.Client_Registration'),
            path: '/registration/client',
            icon: 'UserPlus',
            view: checkPermission('client_registration', permissions)
          },
          {
            id: 'reg2',
            label: t('menu.label.client_registration'),
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
    [t('menu.categories.Pending')]: [
      {
        id: 1,
        label: t('menu.label.registration'),
        path: '',
        icon: 'UserPlus',
        view:
          !client_registration_approval &&
          checkPermissions(['client_registration_approval'], permissions),
        subMenu: [
          {
            id: 'reg1',
            label: t('menu.registration.Client_Registration'),
            path: '/registration/client',
            icon: 'UserPlus',
            view:
              !client_registration_approval &&
              checkPermission('client_registration_approval', permissions)
          },
          {
            id: 'reg2',
            label: t('menu.label.client_registration'),
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
            label: t('menu.account_management.Transactions'),
            path: '/accounts/transactions',
            icon: 'Dollar',
            view: checkPermission('account_transaction_list_view', permissions)
          },
          {
            id: 'acc3',
            label: t('menu.account_management.Incomes'),
            path: '/accounts/incomes',
            icon: 'Dollar',
            view: checkPermission('income_list_view', permissions)
          },
          {
            id: 'acc4',
            label: t('menu.account_management.Expenses'),
            path: '/accounts/expenses',
            icon: 'Dollar',
            view: checkPermission('expense_list_view', permissions)
          },
          {
            id: 'acc5',
            label: t('menu.account_management.Transfers'),
            path: '/accounts/transfers',
            icon: 'Dollar',
            view: checkPermission('account_transfer_list_view', permissions)
          },
          {
            id: 'acc6',
            label: t('menu.account_management.Withdrawals'),
            path: '/accounts/withdrawals',
            icon: 'Dollar',
            view: checkPermission('account_withdrawal_list_view', permissions)
          },
          {
            id: 'acc7',
            label: t('menu.account_management.Income_Categories'),
            path: '/accounts/incomes/categories',
            icon: 'Dollar',
            view: checkPermission('income_category_list_view', permissions)
          },
          {
            id: 'acc8',
            label: t('menu.account_management.Expense_Categories'),
            path: '/accounts/expenses/categories',
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
