import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function NetProfit({ expense_meta, income_meta, net_profit }) {
  const { t } = useTranslation()

  return (
    <table className="table table-bordered table-light">
      <thead>
        <tr className="text-center">
          <th style={{ width: '5%' }}>ক্র/নং</th>
          <th style={{ width: '30%' }}>ব্যয়ের বিবরণ</th>
          <th style={{ width: '15%' }}>টাকা</th>
          <th style={{ width: '5%' }}>ক্র/নং</th>
          <th style={{ width: '30%' }}>আয়ের বিবরণ</th>
          <th style={{ width: '15%' }}>টাকা</th>
        </tr>
        <tr className="text-center">
          <th>১</th>
          <th>২</th>
          <th>৩</th>
          <th>৪</th>
          <th>৫</th>
          <th>৬ </th>
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
  )
}
