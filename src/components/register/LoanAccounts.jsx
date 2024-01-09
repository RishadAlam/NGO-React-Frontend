import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { isEmptyArray } from '../../helper/isEmptyObject'
import useFetch from '../../hooks/useFetch'
import Command from '../../icons/Command'
import TabPanel from '../utilities/TabPanel'
import TabsGroup from '../utilities/TabsGroup'
import RegisterBox from './RegisterBox'
import LoanAccountDetails from './LoanAccountDetails'

export default function LoanAccounts({ prefix = null }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const [loanTabValue, setLoanTabValue] = useState(1)
  const [categories, setCategories] = useState([])

  const { data: { data = [] } = [], isLoading } = useFetch({
    action: `client/registration/loan/${prefix}/${id}`
  })

  useEffect(() => {
    if (!isEmptyArray(data)) {
      setLoanTabValue(data[0]['id'])
      setCategories(
        data.map((loan) => ({
          label: loan.category.is_default
            ? t(`category.default.${loan.category.name}`)
            : loan.category.name,
          value: loan.id,
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
    <RegisterBox className="rounded-top-2">
      <p className="text-center">{t('common.No_Records_Found')}</p>
    </RegisterBox>
  ) : (
    <>
      <RegisterBox className="rounded-top-2 rounded-bottom-2 py-0">
        <TabsGroup defaultValue={loanTabValue} setValue={setLoanTabValue} data={categories} />
      </RegisterBox>
      <RegisterBox className="rounded-top-2 mt-3">
        {data.map((loan, index) => (
          <TabPanel key={index} value={loanTabValue} index={loan.id}>
            <LoanAccountDetails data={loan} />
          </TabPanel>
        ))}
      </RegisterBox>
    </>
  )
}
