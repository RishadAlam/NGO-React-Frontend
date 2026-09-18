// Explicit endpoint policies audited against xFetch callers and their action
// guards. These are business-action grants, never route/list-view permissions.
const resources = [
  ['fields', 'field_registration', 'field_data_update', 'field_soft_delete', 'field_data_update'],
  [
    'centers',
    'center_registration',
    'center_data_update',
    'center_soft_delete',
    'center_data_update'
  ],
  [
    'categories',
    'category_registration',
    'category_data_update',
    'category_soft_delete',
    'category_data_update'
  ],
  [
    'accounts',
    'account_registration',
    'account_data_update',
    'account_soft_delete',
    'account_data_update'
  ],
  ['accounts/incomes', 'income_registration', 'income_data_update', 'income_soft_delete'],
  ['accounts/expenses', null, 'expense_data_update', 'expense_soft_delete'],
  [
    'accounts/incomes/categories',
    'income_category_registration',
    'income_category_data_update',
    'income_category_soft_delete',
    'income_category_data_update'
  ],
  [
    'accounts/expenses/categories',
    'expense_category_registration',
    'expense_category_data_update',
    'expense_category_soft_delete',
    'expense_category_data_update'
  ],
  [
    'accounts/withdrawals',
    'account_withdrawal_registration',
    'account_withdrawal_data_update',
    'account_withdrawal_soft_delete'
  ],
  ['users', 'staff_registration', 'staff_data_update', 'staff_soft_delete', 'staff_status_update'],
  ['roles', 'role_registration', 'role_update', 'role_delete'],
  [
    'audit/meta',
    'audit_report_meta_create',
    'audit_report_meta_update',
    'audit_report_meta_soft_delete'
  ]
]

const exactPolicies = {
  'POST expenses': 'expense_registration',
  'POST accounts/transfers': 'account_transfer_registration',
  'PUT approvals-config-update': 'approvals_config',
  'PUT transfer-transaction-config-update': 'approvals_config',
  'PUT categories-config-update': 'categories_config',
  'PUT app-settings-update': 'app_settings',
  'POST client/registration': 'client_registration',
  'POST client/registration/saving': 'saving_acc_registration',
  'POST client/registration/loan': 'loan_acc_registration',
  'POST saving/check': 'client_saving_account_check',
  'POST loan/check': 'client_loan_account_check',
  'POST closing/saving': 'client_saving_account_closing',
  'POST closing/loan': 'client_loan_account_closing',
  'POST withdrawal/saving': 'permission_to_make_saving_withdrawal',
  'POST withdrawal/loan-saving': 'permission_to_make_loan_saving_withdrawal',
  'POST collection/saving': 'permission_to_do_saving_collection',
  'POST collection/loan': 'permission_to_do_loan_collection'
}

const endpointPolicies = [
  ['POST', /^users\/[^/]+\/impersonation$/, 'staff_impersonate'],
  ['PUT', /^permissions\/[^/]+$/, 'staff_permission_update'],
  ['PUT', /^roles\/[^/]+\/permissions$/, 'role_permission_update'],
  ['PUT', /^client\/registration\/approved\/[^/]+$/, 'pending_client_registration_approval'],
  ['PUT', /^client\/registration\/saving\/approved\/[^/]+$/, 'pending_saving_acc_approval'],
  ['PUT', /^client\/registration\/loan\/approved\/[^/]+$/, 'pending_loan_acc_approval'],
  ['PUT', /^client\/registration\/loan\/loan-approved\/[^/]+$/, 'pending_loan_approval'],
  ['DELETE', /^client\/force-delete\/[^/]+$/, 'pending_client_registration_permanently_delete'],
  ['DELETE', /^client\/saving\/force-delete\/[^/]+$/, 'pending_saving_acc_permanently_delete'],
  ['DELETE', /^client\/loan\/force-delete\/[^/]+$/, 'pending_loan_acc_permanently_delete'],
  ['DELETE', /^client\/registration\/[^/]+$/, 'client_register_account_delete'],
  ['PUT', /^client\/registration\/field-update\/[^/]+$/, 'client_register_account_field_update'],
  ['PUT', /^client\/registration\/center-update\/[^/]+$/, 'client_register_account_center_update'],
  ['PUT', /^client\/registration\/acc-no-update\/[^/]+$/, 'client_register_account_acc_no_update'],
  [
    'PUT',
    /^client\/registration\/saving\/category-update\/[^/]+$/,
    'client_saving_account_category_update'
  ],
  [
    'PUT',
    /^client\/registration\/loan\/category-update\/[^/]+$/,
    'client_loan_account_category_update'
  ],
  [
    'PUT',
    /^client\/registration\/saving\/change-status\/[^/]+$/,
    'client_saving_account_change_status'
  ],
  [
    'PUT',
    /^client\/registration\/loan\/change-status\/[^/]+$/,
    'client_loan_account_change_status'
  ],
  ['PUT', /^closing\/saving\/approved\/[^/]+$/, 'pending_req_to_delete_saving_acc_approval'],
  ['PUT', /^closing\/loan\/approved\/[^/]+$/, 'pending_req_to_delete_loan_acc_approval'],
  ['DELETE', /^closing\/saving\/[^/]+$/, 'pending_req_to_delete_saving_acc_delete'],
  ['DELETE', /^closing\/loan\/[^/]+$/, 'pending_req_to_delete_loan_acc_delete'],
  // Current withdrawal edit/delete callers are exclusively pending workflows.
  ['PUT', /^withdrawal\/saving\/[^/]+$/, 'pending_saving_withdrawal_update'],
  ['PUT', /^withdrawal\/loan-saving\/[^/]+$/, 'pending_loan_saving_withdrawal_update'],
  ['PUT', /^withdrawal\/saving\/approved\/[^/]+$/, 'pending_saving_withdrawal_approval'],
  ['PUT', /^withdrawal\/loan-saving\/approved\/[^/]+$/, 'pending_loan_saving_withdrawal_approval'],
  ['DELETE', /^withdrawal\/saving\/[^/]+$/, 'pending_saving_withdrawal_delete'],
  ['DELETE', /^withdrawal\/loan-saving\/[^/]+$/, 'pending_loan_saving_withdrawal_delete'],
  // This legacy API performs an approval through GET; ordinary reads remain untouched.
  [
    'GET',
    /^transactions\/approve-transactions\/[^/]+\/(saving_to_saving|saving_to_loan|loan_to_saving|loan_to_loan)$/,
    'pending_client_transactions_approval'
  ],
  [
    'DELETE',
    /^transactions\/delete-transactions\/[^/]+\/(saving_to_saving|saving_to_loan|loan_to_saving|loan_to_loan)$/,
    'pending_client_transactions_delete'
  ],
  ['POST', /^recycle-bin\/[^/]+\/[^/]+\/restore$/, 'recycle_bin_restore'],
  ['DELETE', /^recycle-bin\/[^/]+\/[^/]+\/force$/, 'recycle_bin_force_delete']
]

const transactionPermissions = {
  saving_to_saving: 'make_saving_transactions',
  saving_to_loan: 'make_saving_transactions',
  loan_to_saving: 'make_loan_transactions',
  loan_to_loan: 'make_loan_transactions'
}

const contextualPolicies = [
  [
    'PUT',
    /^client\/registration\/[^/]+$/,
    ['pending_client_registration_update', 'client_register_account_update']
  ],
  [
    'PUT',
    /^client\/registration\/saving\/[^/]+$/,
    ['pending_saving_acc_update', 'client_saving_account_update']
  ],
  [
    'PUT',
    /^client\/registration\/loan\/[^/]+$/,
    ['pending_loan_acc_update', 'client_loan_account_update']
  ],
  [
    'PUT',
    /^collection\/saving\/[^/]+$/,
    [
      'regular_saving_collection_update',
      'pending_saving_collection_update',
      'client_saving_account_collection_update'
    ]
  ],
  [
    'PUT',
    /^collection\/loan\/[^/]+$/,
    [
      'regular_loan_collection_update',
      'pending_loan_collection_update',
      'client_loan_account_collection_update'
    ]
  ],
  [
    'DELETE',
    /^collection\/saving\/force-delete\/[^/]+$/,
    [
      'regular_saving_collection_permanently_delete',
      'pending_saving_collection_permanently_delete',
      'client_saving_account_collection_permanently_delete'
    ]
  ],
  [
    'DELETE',
    /^collection\/loan\/force-delete\/[^/]+$/,
    [
      'regular_loan_collection_permanently_delete',
      'pending_loan_collection_permanently_delete',
      'client_loan_account_collection_permanently_delete'
    ]
  ],
  [
    'POST',
    /^collection\/saving\/approved$/,
    ['regular_saving_collection_approval', 'pending_saving_collection_approval']
  ],
  [
    'POST',
    /^collection\/loan\/approved$/,
    ['regular_loan_collection_approval', 'pending_loan_collection_approval']
  ]
]

const field = (data, name) => (data instanceof FormData ? data.get(name) : data?.[name])

// null means no reviewed mutation policy. [] means a recognized mutation whose
// exact permission cannot be determined, and must fail closed on mobile.
// A nonempty array requires ALL listed grants (e.g. staff edit + password reset).
export function resolveMobileMutationPermissions(endpoint, data, method = 'GET', context = {}) {
  const requestedMethod = method.toUpperCase()
  const verb =
    requestedMethod === 'POST'
      ? String(field(data, '_method') || requestedMethod).toUpperCase()
      : requestedMethod
  const path = String(endpoint)
    .split(/[?#]/, 1)[0]
    .replace(/^\/+|\/+$/g, '')

  const exactPermission = exactPolicies[`${verb} ${path}`]
  if (exactPermission) return [exactPermission]

  if (verb === 'POST' && path === 'transactions') {
    const permission = transactionPermissions[field(data, 'type')]
    return permission ? [permission] : []
  }

  for (const [prefix, create, update, remove, status] of resources) {
    if (path === prefix && verb === 'POST' && create) return [create]
    const suffix = path.startsWith(`${prefix}/`) ? path.slice(prefix.length + 1) : ''
    if (status && verb === 'PUT' && /^change-status\/[^/]+$/.test(suffix)) return [status]
    if (!suffix || suffix.includes('/')) continue
    if (verb === 'DELETE') return [remove]
    if (verb === 'PUT') {
      if (prefix === 'users' && (field(data, 'password') || field(data, 'confirm_password'))) {
        return [update, 'staff_reset_password']
      }
      return [update]
    }
  }

  const policy = endpointPolicies.find(
    ([policyMethod, pattern]) => policyMethod === verb && pattern.test(path)
  )
  if (policy) return [policy[2]]

  // Reused endpoints do not identify their workflow. The reviewed caller must
  // supply its exact action grant; granting a sibling workflow is insufficient.
  const contextualPolicy = contextualPolicies.find(
    ([policyMethod, pattern]) => policyMethod === verb && pattern.test(path)
  )
  if (contextualPolicy) {
    return contextualPolicy[2].includes(context?.mobilePermission) ? [context.mobilePermission] : []
  }
  return null
}
