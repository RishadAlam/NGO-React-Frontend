import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import SavingCollectionSheet from '../../components/collection/SavingCollectionSheet'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import { checkPermission } from '../../helper/checkPermission'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import CheckPatch from '../../icons/CheckPatch'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import SaveEnergy from '../../icons/SaveEnergy'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'

export default function SavingReportSheet({ isRegular = true }) {
  const { category_id, field_id } = useParams()
  const { id, permissions: authPermissions } = useAuthDataValue()
  const [dateRange, setDateRange] = useState()
  const [selectedCreator, setSelectedCreator] = useState()
  const { t } = useTranslation()
  const prefix = isRegular ? 'regular' : 'pending'
  const queryParams = isRegular
    ? { user_id: selectedCreator?.id || '' }
    : {
        user_id: selectedCreator?.id || '',
        date: !isRegular ? dateRange || '' : ''
      }

  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const {
    data: { data: { dates = [], collections = [] } = [] } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `collection/saving/${prefix}/collection-sheet/${category_id}/${field_id}`,
    queryParams: queryParams
  })

  const creatorConfig = {
    options: !checkPermission(
      `${isRegular ? 'regular' : 'pending'}_saving_collection_list_view_as_admin`,
      authPermissions
    )
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const datesConfig = {
    options: dates?.map((date) => ({
      label: tsNumbers(dateFormat(date, 'dd/MM/yyyy')),
      value: date
    })),
    value: dateRange
      ? {
          label: tsNumbers(dateFormat(dateRange, 'dd/MM/yyyy')),
          value: dateRange
        }
      : null,
    getOptionLabel: (option) => option.label,
    onChange: (e, option) => setParamsState(option, 'dateRange'),
    isOptionEqualToValue: (option, value) => option.value === value.value
  }

  const setParamsState = (val, name) => {
    if (name === 'dateRange') {
      setDateRange(val.value)
    } else if (name === 'creator') {
      setSelectedCreator(val)
    }
    mutate()
  }

  useEffect(() => {
    if (!dateRange) {
      setDateRange(dates[0])
    }
  }, [dates])

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-12">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t(`menu.label.${isRegular ? 'regular' : 'pending'}_collection`),
                  icon: isRegular ? <BusinessOpportunity size={16} /> : <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('menu.collection.Saving_Collection'),
                  icon: <SaveEnergy size={16} />,
                  active: true
                },
                {
                  name: t('common.category'),
                  icon: <Chrome size={16} />,
                  active: true
                },
                {
                  name: t('common.field'),
                  icon: <Globe size={16} />,
                  active: true
                }
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-lg-4 col-xxl-3 mb-3">
            {creators &&
              checkPermission(
                `${isRegular ? 'regular' : 'pending'}_saving_collection_list_view_as_admin`,
                authPermissions
              ) && <SelectBoxField label={t('common.creator')} config={creatorConfig} />}
          </div>
          <div className="col-lg-4 col-xxl-6 d-md-none d-lg-block"></div>
          {!isRegular && (
            <div className="col-sm-6 col-lg-4 col-xxl-3 text-end mb-3">
              <SelectBoxField label={t('common.date')} config={datesConfig} />
            </div>
          )}
        </div>
        <SavingCollectionSheet
          data={collections}
          loading={isLoading}
          mutate={mutate}
          isRegular={isRegular}
        />
      </section>
    </>
  )
}
