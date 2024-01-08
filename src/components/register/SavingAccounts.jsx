import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { isEmptyArray } from '../../helper/isEmptyObject'
import useFetch from '../../hooks/useFetch'
import Command from '../../icons/Command'
import TabPanel from '../utilities/TabPanel'
import TabsGroup from '../utilities/TabsGroup'
import RegisterBox from './RegisterBox'
import SavingAccountDetails from './SavingAccountDetails'

export default function SavingAccounts() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [savingTabValue, setSavingTabValue] = useState(1)
  const [categories, setCategories] = useState([])
  const { data: { data = [] } = [], isLoading } = useFetch({
    action: `client/registration/saving/${id}`
  })

  useEffect(() => {
    if (!isEmptyArray(data)) {
      setSavingTabValue(data[0]['id'])
      setCategories(
        data.map((saving) => ({
          label: saving.category.is_default
            ? t(`common.category.${saving.category.name}`)
            : saving.category.name,
          value: saving.id,
          icon: (
            <span className="me-2">
              <Command />
            </span>
          )
        }))
      )
    }
  }, [data, t])

  return (
    <>
      <RegisterBox className="rounded-top-2 rounded-bottom-2 py-0">
        <TabsGroup defaultValue={savingTabValue} setValue={setSavingTabValue} data={categories} />
      </RegisterBox>
      <RegisterBox className="rounded-top-2 mt-3">
        {data.map((saving, index) => (
          <TabPanel key={index} value={savingTabValue} index={saving.id}>
            <SavingAccountDetails data={saving} />
          </TabPanel>
        ))}
      </RegisterBox>
    </>
  )
}
