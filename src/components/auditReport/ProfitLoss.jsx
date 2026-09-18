import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function ProfitLoss({ expenses, incomes, profit_loss }) {
  const { t } = useTranslation()

  return (
    <div className="table-responsive table-scroll-both">
      <table className="table table-bordered table-light mobile-hide-paired-serial">
        <thead>
          <tr className="text-center">
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.expense_details')}</th>
            <th style={{ width: '15%' }}>{t('localization.domain.taka')}</th>
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.income_details')}</th>
            <th style={{ width: '15%' }}>{t('localization.domain.taka')}</th>
          </tr>
          <tr className="text-center">
            <th>{tsNumbers(1)}</th>
            <th>{tsNumbers(2)}</th>
            <th>{tsNumbers(3)}</th>
            <th>{tsNumbers(4)}</th>
            <th>{tsNumbers(5)}</th>
            <th>{tsNumbers(6)}</th>
          </tr>
        </thead>
        <tbody style={{ border: 'none' }}>
          {(expenses.length > incomes.length ? expenses : incomes).map((field, index) => (
            <tr key={index}>
              {index < expenses.length ? (
                <>
                  <td className="text-center">{tsNumbers(index + 1)}</td>
                  <td>
                    {defaultNameCheck(
                      t,
                      expenses[index].is_default,
                      'audit_report_meta.default.',
                      expenses[index].key
                    )}
                  </td>
                  <td className="text-end">{tsNumbers(expenses[index].value)}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                </>
              )}
              {index < incomes.length ? (
                <>
                  <td className="text-center">{tsNumbers(index + 1)}</td>
                  <td>
                    {defaultNameCheck(
                      t,
                      incomes[index].is_default,
                      'audit_report_meta.default.',
                      incomes[index].key
                    )}
                  </td>
                  <td className="text-end">{tsNumbers(incomes[index].value)}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
        <tfoot className="text-end">
          {Object.keys(profit_loss.total_expenses).map((key, index) => (
            <tr key={index}>
              <td></td>
              <td>{defaultNameCheck(t, true, 'audit_report_meta.default.', key)}</td>
              <td>{tsNumbers(profit_loss.total_expenses[key])}</td>
              <td></td>
              <td>
                {defaultNameCheck(
                  t,
                  true,
                  'audit_report_meta.default.',
                  Object.keys(profit_loss.total_incomes)[index]
                )}
              </td>
              <td>
                {tsNumbers(
                  profit_loss.total_incomes[Object.keys(profit_loss.total_incomes)[index]]
                )}
              </td>
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}
