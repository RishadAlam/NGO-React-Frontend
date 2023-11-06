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
    data: categories = [],
    mutate,
    isLoading,
    isError
  } = useFetch({ action: 'categories-config' })

  useEffect(() => {
    categories.length && setAllConfigurations(categories)
  }, [categories])

  const setChange = (val, name, index) => {
    setAllConfigurations((prevConfig) =>
      create(prevConfig, (draftConfig) => {
        if (
          name === 's_reg_fee_acc_id' ||
          name === 's_col_fee_acc_id' ||
          name === 'l_reg_fee_acc_id' ||
          name === 'l_col_fee_acc_id' ||
          name === 's_with_fee_acc_id' ||
          name === 'ls_with_fee_acc_id'
        ) {
          const tmp = `${name.slice(0, name.indexOf('acc_id'))}account`
          draftConfig[index][tmp] = val
          draftConfig[index][name] = val?.id || 0
          return
        }

        if ((val !== '' && Number(val) === 0) || val === false || val.length > 8) {
          val = 0
        }

        draftConfig[index][name] = val
      })
    )

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        if (val === '') {
          draftErr[name] = true
        } else {
          delete draftErr[name]
        }
      })
    )
  }

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
            error={error}
            setChange={setChange}
            update={updateConfig}
            loading={loading?.CategoriesConfig || false}
          />
        )}
      </section>
    </>
  )
}
