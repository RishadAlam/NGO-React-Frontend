import { create, rawReturn } from 'mutative'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { useLoadingState } from '../../atoms/loaderAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import CategoryConfig from '../../components/categoriesConfig/CategoryConfig'
import ReactTableSkeleton from '../../components/loaders/skeleton/ReactTableSkeleton'
import useFetch from '../../hooks/useFetch'
import Home from '../../icons/Home'
import Settings from '../../icons/Settings'
import Tool from '../../icons/Tool'
import xFetch from '../../utilities/xFetch'

export default function CategoriesConfig() {
  const { t } = useTranslation()
  const [allConfigurations, setAllConfigurations] = useState([])
  const [loading, setLoading] = useLoadingState({})
  const [error, setError] = useState({})
  const { accessToken } = useAuthDataValue()
  const {
    data: { data: categories = [] } = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'categories-config' })

  useEffect(() => {
    categories.length && setAllConfigurations(categories)
  }, [categories])

  const updateConfig = (event) => {
    event.preventDefault()

    setLoading({ ...loading, CategoriesConfig: true })
    xFetch(
      'categories-config-update',
      { categoriesConfig: allConfigurations },
      null,
      accessToken,
      null,
      'PUT'
    )
      .then((response) => {
        setLoading({ ...loading, CategoriesConfig: false })
        if (response?.success) {
          toast.success(response.message)
          mutate()
          return
        }
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!response?.errors) {
              draftErr.message = response?.message
              return
            }
            return rawReturn(response?.errors || response)
          })
        )
      })
      .catch((errorResponse) => {
        setLoading({ ...loading, CategoriesConfig: false })
        setError((prevErr) =>
          create(prevErr, (draftErr) => {
            if (!errorResponse?.errors) {
              draftErr.message = errorResponse?.message
              return
            }
            return rawReturn(errorResponse?.errors || errorResponse)
          })
        )
      })
  }

  return (
    <>
      <section className="staff-permissions">
        <Breadcrumb
          breadcrumbs={[
            { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
            {
              name: t('menu.label.settings_and_privacy'),
              icon: <Settings size={16} />,
              active: false
            },
            {
              name: t('menu.settings_and_privacy.categories_config'),
              icon: <Tool size={16} />,
              active: true
            }
          ]}
        />

        {isLoading ? (
          <ReactTableSkeleton />
        ) : (
          <CategoryConfig
            allConfigurations={allConfigurations}
            setAllConfigurations={setAllConfigurations}
            error={error}
            setError={setError}
            update={updateConfig}
            loading={loading?.CategoriesConfig || false}
          />
        )}
      </section>
    </>
  )
}
