import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function DepositExpenditure({ depositMeta, expenditureMeta, deposit_expenditure }) {
  const { t } = useTranslation()

  return (
    <table className="table table-bordered table-light">
      <thead>
        <tr className="text-center">
          <th style={{ width: '5%' }}>ক্র/নং</th>
          <th style={{ width: '30%' }}>প্রাপ্তি সমূহ</th>
          <th style={{ width: '15%' }}>টাকা</th>
          <th style={{ width: '5%' }}>ক্র/নং</th>
          <th style={{ width: '30%' }}>প্রদান সমূহ</th>
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
        {(depositMeta.length > expenditureMeta.length ? depositMeta : expenditureMeta).map(
          (field, index) => (
            <tr key={index}>
              {index < depositMeta.length ? (
                <>
                  <td className="text-center">{tsNumbers(index + 1)}</td>
                  <td>
                    {defaultNameCheck(
                      t,
                      depositMeta[index].is_default,
                      'audit_report_meta.default.',
                      depositMeta[index].key
                    )}
                  </td>
                  <td className="text-end">{tsNumbers(depositMeta[index].value)}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                </>
              )}
              {index < expenditureMeta.length ? (
                <>
                  <td className="text-center">{tsNumbers(index + 1)}</td>
                  <td>
                    {defaultNameCheck(
                      t,
                      expenditureMeta[index].is_default,
                      'audit_report_meta.default.',
                      expenditureMeta[index].key
                    )}
                  </td>
                  <td className="text-end">{tsNumbers(expenditureMeta[index].value)}</td>
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
        {Object.keys(deposit_expenditure.total_collections).map((key, index) => (
          <tr key={index}>
            <td></td>
            <td>{defaultNameCheck(t, true, 'audit_report_meta.default.', key)}</td>
            <td>{tsNumbers(deposit_expenditure.total_collections[key])}</td>
            <td></td>
            <td>
              {defaultNameCheck(
                t,
                true,
                'audit_report_meta.default.',
                Object.keys(deposit_expenditure.total_distributions)[index]
              )}
            </td>
            <td>
              {tsNumbers(
                deposit_expenditure.total_distributions[
                  Object.keys(deposit_expenditure.total_distributions)[index]
                ]
              )}
            </td>
          </tr>
        ))}
      </tfoot>
    </table>
  )
}
