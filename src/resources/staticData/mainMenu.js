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
        icon: 'Pen',
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
            label: t('menu.registration.saving_account_registration'),
            path: '/registration/saving-account',
            icon: 'BankTransferIn',
            view: checkPermission('saving_acc_registration', permissions)
          },
          {
            id: 'reg3',
            label: t('menu.registration.loan_account_registration'),
            path: '/registration/loan-account',
            icon: 'BankTransferOut',
            view: checkPermission('loan_acc_registration', permissions)
          }
        ]
      },
      {
        id: 2,
        label: t('menu.label.regular_collection'),
        path: '',
        icon: 'BusinessOpportunity',
        view: checkPermissions(
          [
            'regular_saving_collection_list_view',
            'regular_saving_collection_list_view_as_admin',
            'regular_loan_collection_list_view',
            'regular_loan_collection_list_view_as_admin'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'regularCollection1',
            label: t('menu.collection.Saving_Collection'),
            path: '/collection/regular/saving',
            icon: 'SaveEnergy',
            view: checkPermissions(
              [
                'regular_saving_collection_list_view',
                'regular_saving_collection_list_view_as_admin'
              ],
              permissions
            )
          },
          {
            id: 'regularCollection1',
            label: t('menu.collection.Loan_Collection'),
            path: '/collection/regular/loan',
            icon: 'Loan',
            view: checkPermissions(
              ['regular_loan_collection_list_view', 'regular_loan_collection_list_view_as_admin'],
              permissions
            )
          }
        ]
      }
    ],
    [t('menu.categories.Pending_Approval')]: [
      {
        id: 1,
        label: t('menu.label.pending_loans'),
        path: '/pending/loans',
        icon: 'BankTransferOut',
        view: checkPermissions(['pending_loan_view', 'pending_loan_view_as_admin'], permissions)
      },
      {
        id: 2,
        label: `${t('menu.categories.Pending_Approval')} ${t('menu.label.registration')}`,
        path: '',
        icon: 'CheckPatch',
        view: checkPermissions(
          [
            'pending_client_registration_list_view',
            'pending_client_registration_list_view_as_admin',
            'pending_saving_acc_list_view',
            'pending_saving_acc_list_view_as_admin',
            'pending_loan_acc_list_view',
            'pending_loan_acc_list_view_as_admin'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'pndReg1',
            label: t('menu.registration.Client_Registration'),
            path: '/pending/registration/client',
            icon: 'UserPlus',
            view: checkPermissions(
              [
                'pending_client_registration_list_view',
                'pending_client_registration_list_view_as_admin'
              ],
              permissions
            )
          },
          {
            id: 'pndReg2',
            label: t('menu.registration.saving_account_registration'),
            path: '/pending/registration/saving-account',
            icon: 'BankTransferIn',
            view: checkPermissions(
              ['pending_saving_acc_list_view', 'pending_saving_acc_list_view_as_admin'],
              permissions
            )
          },
          {
            id: 'pndReg3',
            label: t('menu.registration.loan_account_registration'),
            path: '/pending/registration/loan-account',
            icon: 'BankTransferOut',
            view: checkPermissions(
              ['pending_loan_acc_list_view', 'pending_loan_acc_list_view_as_admin'],
              permissions
            )
          }
        ]
      },
      {
        id: 3,
        label: t('menu.label.pending_collection'),
        path: '',
        icon: 'CheckPatch',
        view: checkPermissions(
          [
            'pending_saving_collection_list_view',
            'pending_saving_collection_list_view_as_admin',
            'pending_loan_collection_list_view',
            'pending_loan_collection_list_view_as_admin'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'pendingCollection1',
            label: t('menu.collection.Saving_Collection'),
            path: '/collection/pending/saving',
            icon: 'SaveEnergy',
            view: checkPermissions(
              [
                'pending_saving_collection_list_view',
                'pending_saving_collection_list_view_as_admin'
              ],
              permissions
            )
          },
          {
            id: 'pendingCollection2',
            label: t('menu.collection.Loan_Collection'),
            path: '/collection/pending/loan',
            icon: 'Loan',
            view: checkPermissions(
              ['pending_loan_collection_list_view', 'pending_loan_collection_list_view_as_admin'],
              permissions
            )
          }
        ]
      },
      {
        id: 4,
        label: t('menu.label.pending_withdrawals'),
        path: '',
        icon: 'CheckPatch',
        view: checkPermissions(
          [
            'pending_saving_withdrawal_list_view',
            'pending_saving_withdrawal_list_view_as_admin',
            'pending_loan_saving_withdrawal_list_view',
            'pending_loan_saving_withdrawal_list_view_as_admin'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'pendingWithdrawal1',
            label: t('menu.withdrawal.Saving_Withdrawal'),
            path: '/pending/withdrawal/saving',
            icon: 'CashWithdrawal',
            view: checkPermissions(
              [
                'pending_saving_withdrawal_list_view',
                'pending_saving_withdrawal_list_view_as_admin'
              ],
              permissions
            )
          },
          {
            id: 'pendingWithdrawal2',
            label: t('menu.withdrawal.Loan_Saving_Withdrawal'),
            path: '/pending/withdrawal/loan-saving',
            icon: 'CashWithdrawal',
            view: checkPermissions(
              [
                'pending_loan_saving_withdrawal_list_view',
                'pending_loan_saving_withdrawal_list_view_as_admin'
              ],
              permissions
            )
          }
        ]
      },
      {
        id: 5,
        label: t('menu.label.pending_acc_delete_req'),
        path: '',
        icon: 'Trash',
        view: checkPermissions(
          [
            'pending_req_to_delete_saving_acc_list_view',
            'pending_req_to_delete_saving_acc_list_view_as_admin',
            'pending_req_to_delete_loan_acc_list_view',
            'pending_req_to_delete_loan_acc_list_view_as_admin'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'pendingWithdrawal1',
            label: t('menu.delete.Saving_Delete'),
            path: '/pending/delete/saving',
            icon: 'Trash',
            view: checkPermissions(
              [
                'pending_req_to_delete_saving_acc_list_view',
                'pending_req_to_delete_saving_acc_list_view_as_admin'
              ],
              permissions
            )
          },
          {
            id: 'pendingWithdrawal2',
            label: t('menu.delete.Loan_Delete'),
            path: '/pending/delete/loan-saving',
            icon: 'Trash',
            view: checkPermissions(
              [
                'pending_req_to_delete_loan_acc_list_view',
                'pending_req_to_delete_loan_acc_list_view_as_admin'
              ],
              permissions
            )
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
        label: t('menu.label.registered_account_list'),
        path: '',
        icon: 'Pen',
        view: checkPermissions(
          [
            'registered_client_account_list_view',
            'registered_saving_account_list_view',
            'registered_loan_account_list_view'
          ],
          permissions
        ),
        subMenu: [
          {
            id: 'regAccList1',
            label: `${t('menu.registration.Client_Registration')} ${t('common.list')}`,
            path: '/registered/client',
            icon: 'UserPlus',
            view: checkPermission('registered_client_account_list_view', permissions)
          },
          {
            id: 'regAccList2',
            label: `${t('menu.registration.saving_account_registration')} ${t('common.list')}`,
            path: '/registered/saving-account',
            icon: 'BankTransferIn',
            view: checkPermission('registered_saving_account_list_view', permissions)
          },
          {
            id: 'regAccList3',
            label: `${t('menu.registration.loan_account_registration')} ${t('common.list')}`,
            path: '/registered/loan-account',
            icon: 'BankTransferOut',
            view: checkPermission('registered_loan_account_list_view', permissions)
          }
        ]
      },
      {
        id: 5,
        label: t('menu.label.account_management'),
        path: '',
        icon: 'BankTransfer',
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
        id: 6,
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
        id: 7,
        label: t('menu.label.audit'),
        path: '',
        icon: 'AuditIcon',
        view: checkPermissions(
          ['audit_report_meta_list_view', 'cooperative_audit_report_view'],
          permissions
        ),
        subMenu: [
          {
            id: 'audit1',
            label: t('menu.audit.report_meta'),
            path: '/audit-report/meta',
            icon: 'Edit',
            view: checkPermission('audit_report_meta_list_view', permissions)
          },
          {
            id: 'audit2',
            label: t('menu.audit.audit_report'),
            path: '/audit-report',
            icon: 'AuditReportIcon',
            view: checkPermission('cooperative_audit_report_view', permissions)
          }
        ]
      },
      {
        id: 8,
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
