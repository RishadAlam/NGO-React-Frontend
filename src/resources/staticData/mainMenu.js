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
        icon: '',
        view: checkPermissions([], permissions),
        subMenu: [
          {
            id: 'reg1',
            label: 'Client Registration',
            path: '/client-registration',
            icon: '',
            view: checkPermission('', permissions)
          },
          {
            id: 'reg2',
            label: 'Create Saving Account',
            path: '/create-saving-account',
            icon: '',
            view: checkPermission('', permissions)
          },
          {
            id: 'reg3',
            label: 'Create Loan Account',
            path: '/create-loan-account',
            icon: '',
            view: checkPermission('', permissions)
          }
        ]
      }
    ],
    [t('menu.categories.Control_Panel')]: [
      {
        id: 2,
        label: t('menu.label.staff'),
        path: '',
        icon: '',
        view: true,
        subMenu: [
          {
            id: 'staff1',
            label: 'Staff',
            path: '/staff',
            icon: '',
            view: true
          },
          {
            id: 'staff2',
            label: 'Staff Permissions',
            path: '/staff-permissions',
            icon: '',
            view: true
          }
        ]
      }
    ]
  }
}
