import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { isEmptyArray } from '../../helper/isEmptyObject'
import useFetch from '../../hooks/useFetch'
import Command from '../../icons/Command'
import TabPanel from '../utilities/TabPanel'
import TabsGroup from '../utilities/TabsGroup'
import LoanAccountDetails from './LoanAccountDetails'
import RegisterBox from './RegisterBox'
import SavingAccountDetails from './SavingAccountDetails'

export default function ClientAccounts({ module = null, prefix = null }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const [tabValue, setTabValue] = useState(1)
  const [categories, setCategories] = useState([])

  const { data: { data = [] } = [], isLoading } = useFetch({
    action: `client/registration/${module}/${prefix}/${id}`
  })

  useEffect(() => {
    if (!isEmptyArray(data)) {
      setTabValue(data[0]['id'])
      setCategories(
        data.map((value) => ({
          label: value.category.is_default
            ? t(`category.default.${value.category.name}`)
            : value.category.name,
          value: value.id,
          icon: (
            <span className="me-2">
              <Command />
            </span>
          )
        }))
      )
    }
  }, [data, t])

  return isEmptyArray(data) ? (
    <RegisterBox className="rounded-top-2 shadow rounded-4">
      <p className="text-center">{t('common.No_Records_Found')}</p>
    </RegisterBox>
  ) : (
    <>
      <RegisterBox className="rounded-top-2 rounded-bottom-2 shadow rounded-4 py-0">
        <TabsGroup defaultValue={tabValue} setValue={setTabValue} data={categories} />
      </RegisterBox>
      <RegisterBox className="rounded-top-2 shadow rounded-4 mt-3">
        {data.map((value, index) => (
          <TabPanel key={index} value={tabValue} index={value.id}>
            {module === 'saving' ? (
              <SavingAccountDetails data={value} />
            ) : (
              <LoanAccountDetails data={value} />
            )}
          </TabPanel>
        ))}
      </RegisterBox>
    </>
  )
}
