import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function NetProfit({ expense_meta, income_meta, net_profit }) {
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
          {(expense_meta.length > income_meta.length ? expense_meta : income_meta).map(
            (field, index) => (
              <tr key={index}>
                {index < expense_meta.length ? (
                  <>
                    <td className="text-center">{tsNumbers(index + 1)}</td>
                    <td>
                      {defaultNameCheck(
                        t,
                        expense_meta[index].is_default,
                        'audit_report_meta.default.',
                        expense_meta[index].key
                      )}
                    </td>
                    <td className="text-end">{tsNumbers(expense_meta[index].value)}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
                {index < income_meta.length ? (
                  <>
                    <td className="text-center">{tsNumbers(index + 1)}</td>
                    <td>
                      {defaultNameCheck(
                        t,
                        income_meta[index].is_default,
                        'audit_report_meta.default.',
                        income_meta[index].key
                      )}
                    </td>
                    <td className="text-end">{tsNumbers(income_meta[index].value)}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            )
          )}
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
          <tr>
            <td></td>
            <td>{t('audit_report_meta.default.total')}</td>
            <td>{tsNumbers(net_profit.total_incomes.total)}</td>
            <td></td>
            <td>{t('audit_report_meta.default.total')}</td>
            <td>{tsNumbers(net_profit.total_expenses.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
