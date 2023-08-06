export const menu = {
  'New Entry': [
    {
      id: 1,
      label: 'Registrations',
      path: '',
      icon: '',
      permissions: [23, 24],
      subMenu: [
        {
          id: 1,
          label: 'Client Registration',
          path: '/client-registration',
          icon: '',
          permissions: [23]
        },
        {
          id: 2,
          label: 'Create Saving Account',
          path: '/create-saving-account',
          icon: '',
          permissions: [24]
        },
        {
          id: 3,
          label: 'Create Loan Account',
          path: '/create-loan-account',
          icon: '',
          permissions: []
        }
      ]
    }
  ]
}
