import { getRecoil } from 'recoil-nexus'
import { authDataState } from '../../atoms/authAtoms'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'

export const mainMenu = (t) => {
  const { permissions } = getRecoil(authDataState)

  return {
    'New Entry': [
      {
        id: 1,
        label: t('menu.registration_label'),
        path: '',
        icon: '',
        view: checkPermissions([], permissions),
        subMenu: [
          {
            id: 1,
            label: 'Client Registration',
            path: '/client-registration',
            icon: '',
            view: checkPermission('', permissions)
          },
          {
            id: 2,
            label: 'Create Saving Account',
            path: '/create-saving-account',
            icon: '',
            view: checkPermission('', permissions)
          },
          {
            id: 3,
            label: 'Create Loan Account',
            path: '/create-loan-account',
            icon: '',
            view: checkPermission('', permissions)
          }
        ]
      }
    ]
  }
}
