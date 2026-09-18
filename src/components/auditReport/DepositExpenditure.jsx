import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function DepositExpenditure({ depositMeta, expenditureMeta, deposit_expenditure }) {
  const { t } = useTranslation()

  return (
    <div className="table-responsive table-scroll-both">
      <table className="table table-bordered table-light mobile-hide-paired-serial">
        <thead>
          <tr className="text-center">
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.receipts')}</th>
            <th style={{ width: '15%' }}>{t('localization.domain.taka')}</th>
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.payments')}</th>
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
    </div>
  )
}
