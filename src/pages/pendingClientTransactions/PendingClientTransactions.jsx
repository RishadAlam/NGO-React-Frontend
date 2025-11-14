import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import AndroidSwitch from '../../components/utilities/AndroidSwitch'
import Avatar from '../../components/utilities/Avatar'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { checkPermission, checkPermissions } from '../../helper/checkPermission'
import { deleteWithdrawal } from '../../helper/collectionActions'
import useFetch from '../../hooks/useFetch'
import CheckPatch from '../../icons/CheckPatch'
import Home from '../../icons/Home'
import Trash from '../../icons/Trash'
import { PendingTransactionTableColumns } from '../../resources/staticData/tableColumns'

export default function PendingClientTransactions({ type }) {
  const { t } = useTranslation()
  const windowWidth = useWindowInnerWidthValue()
  const { accessToken, permissions: authPermissions } = useAuthDataValue()
  const [loading, setLoading] = useLoadingState({})
  // const permissionPrefix = prefix === 'saving' ? 'saving' : 'loan_saving'

  const {
    data: { data: transactions } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `transactions/pending-transactions/${type}`
  })

  const avatar = (name, img) => <Avatar name={name} img={img} />
  const statusSwitch = (value) =>
    checkPermission(`pending_client_transactions_approval`, authPermissions) && (
      <AndroidSwitch
        value={Number(value) ? true : false}
        toggleStatus={(e) => console.log(e)}
        disabled={loading?.approval || false}
      />
    )

  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      {checkPermission(`pending_client_transactions_delete`, authPermissions) && (
        <Tooltip
          TransitionComponent={Zoom}
          title="Delete"
          arrow
          followCursor
          disabled={loading?.transactionDelete || false}>
          <IconButton
            className="text-danger"
            onClick={() => deleteWithdrawal('', id, t, accessToken, mutate, loading, setLoading)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  const descParser = (value) => (
    <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: value }}></div>
  )

  const columns = useMemo(
    () =>
      PendingTransactionTableColumns(
        t,
        windowWidth,
        avatar,
        statusSwitch,
        descParser,
        actionBtnGroup,
        !checkPermission(`pending_client_transactions_approval`, authPermissions),
        !checkPermissions(
          [
            `pending_client_transactions_list_view`,
            `pending_client_transactions_list_view_as_admin`,
            `pending_client_transactions_delete`
          ],
          authPermissions
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth, loading]
  )

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t('menu.label.pending_transactions'),
                  icon: <CheckPatch size={16} />,
                  active: false
                }
              ]}
            />
          </div>
        </div>
        <div className="staff-table">
          {isLoading && !transactions ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable
              title={t('menu.label.pending_transactions')}
              columns={columns}
              data={transactions}
              footer={true}
            />
          )}
        </div>
      </section>
    </>
  )
}
