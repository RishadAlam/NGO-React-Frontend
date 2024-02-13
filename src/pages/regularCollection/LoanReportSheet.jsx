import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import LoanCollectionSheet from '../../components/collection/LoanCollectionSheet'
import DatePickerInputField from '../../components/utilities/DatePickerInputField'
import SelectBoxField from '../../components/utilities/SelectBoxField'
import { checkPermission } from '../../helper/checkPermission'
import useFetch from '../../hooks/useFetch'
import BusinessOpportunity from '../../icons/BusinessOpportunity'
import CheckPatch from '../../icons/CheckPatch'
import Chrome from '../../icons/Chrome'
import Globe from '../../icons/Globe'
import Home from '../../icons/Home'
import Loan from '../../icons/Loan'

export default function LoanReportSheet({ isRegular = true }) {
  const { category_id, field_id } = useParams()
  const { id, permissions: authPermissions } = useAuthDataValue()
  const [dateRange, setDateRange] = useState(new Date(Date.now() - 864e5))
  const [selectedCreator, setSelectedCreator] = useState()
  const { t } = useTranslation()
  const prefix = isRegular ? 'regular' : 'pending'

  const { data: { data: creators = [] } = [] } = useFetch({ action: 'users/active' })
  const {
    data: { data: regularCollections = [] } = [],
    mutate,
    isLoading
  } = useFetch({
    action: `collection/loan/${prefix}/collection-sheet/${category_id}/${field_id}`,
    queryParams: {
      user_id: selectedCreator?.id || '',
      date: !isRegular ? dateRange.toISOString() || '' : ''
    }
  })

  const creatorConfig = {
    options: !checkPermission(
      `${isRegular ? 'regular' : 'pending'}_loan_collection_list_view_as_admin`,
      authPermissions
    )
      ? creators.filter((creator) => creator?.id === id)
      : creators,
    value: selectedCreator || null,
    getOptionLabel: (option) => option.name,
    onChange: (e, option) => setParamsState(option, 'creator'),
    isOptionEqualToValue: (option, value) => option.id === value.id
  }

  const setParamsState = (val, name) => {
    if (name === 'dateRange') {
      setDateRange(new Date(val))
    } else if (name === 'creator') {
      setSelectedCreator(val)
    }
    mutate()
  }

  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
                {
                  name: t(`menu.label.${isRegular ? 'regular' : 'pending'}_collection`),
                  icon: isRegular ? <BusinessOpportunity size={16} /> : <CheckPatch size={16} />,
                  active: false
                },
                {
                  name: t('menu.collection.Loan_Collection'),
                  icon: <Loan size={16} />,
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
                `${isRegular ? 'regular' : 'pending'}_loan_collection_list_view_as_admin`,
                authPermissions
              ) && <SelectBoxField label={t('common.creator')} config={creatorConfig} />}
          </div>
          <div className="col-lg-4 col-xxl-6 d-md-none d-lg-block"></div>
          {!isRegular && (
            <div className="col-sm-6 col-lg-4 col-xxl-3 text-end mb-3">
              <DatePickerInputField
                defaultValue={dateRange}
                setChange={(val) => setParamsState(val, 'dateRange')}
              />
            </div>
          )}
        </div>
        <LoanCollectionSheet
          data={regularCollections}
          loading={isLoading}
          mutate={mutate}
          isRegular={isRegular}
        />
      </section>
    </>
  )
}
