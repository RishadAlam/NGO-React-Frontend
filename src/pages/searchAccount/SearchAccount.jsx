import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useWindowInnerWidthValue } from '../../atoms/windowSize'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import ActionBtnGroup from '../../components/utilities/ActionBtnGroup'
import Avatar from '../../components/utilities/Avatar'
import Button from '../../components/utilities/Button'
import ReactTable from '../../components/utilities/tables/ReactTable'
import { isEmpty } from '../../helper/isEmpty'
import Folder from '../../icons/Folder'
import Home from '../../icons/Home'
import Search from '../../icons/Search'
import tsNumbers from '../../libs/tsNumbers'
import { SearchAccountTableColumns } from '../../resources/staticData/tableColumns'
import xFetch from '../../utilities/xFetch'

export default function SearchAccount() {
  const { t } = useTranslation()
  const location = useLocation()
  const windowWidth = useWindowInnerWidthValue()
  const { accessToken } = useAuthDataValue()
  const [isLoading, setIsLoading] = useState(false)
  const [searchKey, setSearchKey] = useState()
  const [searchData, setSearchData] = useState(location?.state?.searchData || [])
  const avatar = (name, img) => <Avatar name={name} img={img} />

  const liveSearch = (e) => {
    e.preventDefault()

    if (isEmpty(searchKey)) {
      setSearchData([])
      return
    }

    setIsLoading(true)
    xFetch('client/registration', null, null, accessToken, { search: searchKey })
      .then((response) => {
        setIsLoading(false)
        if (response?.success) {
          setSearchData(response.data)
          return
        }
      })
      .catch((errResponse) => {
        setIsLoading(false)
        if (!errResponse?.errors) {
          toast.error(errResponse?.message)
        }
      })
  }

  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="View" arrow followCursor>
        <IconButton className="text-primary">
          <Link to={`/client-register/${id}`}>
            <Folder size={20} />
          </Link>
        </IconButton>
      </Tooltip>
    </ActionBtnGroup>
  )

  const columns = useMemo(
    () => SearchAccountTableColumns(t, windowWidth, avatar, actionBtnGroup),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, windowWidth]
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
                  name: t('common.search'),
                  icon: <Search size={16} />,
                  active: false
                }
              ]}
            />
          </div>
        </div>
        <div className="pt-2 pb-4 px-5">
          <div className="mainSearchBox">
            <form onSubmit={liveSearch}>
              <input
                type="text"
                className="form-control form-input"
                placeholder={t('common.search_placeholder')}
                value={searchKey ? tsNumbers(searchKey) : ''}
                onChange={(e) => setSearchKey(tsNumbers(e.target.value, true))}
              />
              <span className="left-pan">
                <Button
                  name={<Search size={20} />}
                  disabled={false}
                  loading={false}
                  type="submit"
                />
              </span>
            </form>
          </div>
        </div>
        <div className="staff-table">
          {isLoading ? (
            <ReactTableSkeleton />
          ) : (
            <ReactTable title={t('common.search')} columns={columns} data={searchData} />
          )}
        </div>
      </section>
    </>
  )
}
