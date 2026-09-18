import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import tsNumbers from '../../libs/tsNumbers'

export default function SurplusValue({
  capital_meta,
  resource_meta,
  surplus_value,
  net_profit,
  net_loss
}) {
  const { t } = useTranslation()

  capital_meta =
    Number(net_profit) > 0
      ? capital_meta
      : capital_meta &&
        capital_meta.filter((meta) =>
          [
            'authorized_shares',
            'paid_up_shares',
            'savings_deposit',
            'fixed_deposit',
            'accumulation_of_savings'
          ].includes(meta.key)
        )

  resource_meta =
    Number(net_loss) > 0
      ? resource_meta
      : resource_meta && resource_meta.filter((meta) => !['net_loss'].includes(meta.key))

  return (
    <div className="table-responsive table-scroll-both">
      <table className="table table-bordered table-light mobile-hide-paired-serial">
        <thead>
          <tr className="text-center">
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.capital_liabilities')}</th>
            <th style={{ width: '15%' }}>{t('localization.domain.taka')}</th>
            <th style={{ width: '8%' }}>{t('localization.domain.serial_no')}</th>
            <th style={{ width: '27%' }}>{t('localization.domain.assets')}</th>
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
          {(capital_meta.length > resource_meta.length ? capital_meta : resource_meta).map(
            (field, index) => (
              <tr key={index}>
                {index < capital_meta.length ? (
                  <>
                    <td className="text-center">{tsNumbers(index + 1)}</td>
                    <td>
                      {defaultNameCheck(
                        t,
                        capital_meta[index].is_default,
                        'audit_report_meta.default.',
                        capital_meta[index].key
                      )}
                      {capital_meta[index]?.child_meta &&
                        capital_meta[index].value > 0 &&
                        Object.keys(capital_meta[index]?.child_meta).map((meta_key, key) => (
                          <Fragment key={key}>
                            <div className="d-flex justify-content-between mt-2">
                              {meta_key === 'share_per_each' ? (
                                <span>
                                  {t('localization.domain.share_rate', {
                                    amount: tsNumbers(capital_meta[index].child_meta[meta_key])
                                  })}
                                </span>
                              ) : (
                                capital_meta[index].child_meta[meta_key] > 0 && (
                                  <>
                                    <span>
                                      {defaultNameCheck(
                                        t,
                                        true,
                                        'audit_report_meta.default.',
                                        meta_key
                                      )}
                                    </span>
                                    <span>
                                      {tsNumbers(capital_meta[index].child_meta[meta_key])}
                                    </span>
                                  </>
                                )
                              )}
                            </div>
                          </Fragment>
                        ))}
                      <br />
                    </td>
                    <td className="text-end">{tsNumbers(capital_meta[index].value)}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
                {index < resource_meta.length ? (
                  <>
                    <td className="text-center">{tsNumbers(index + 1)}</td>
                    <td>
                      {defaultNameCheck(
                        t,
                        resource_meta[index].is_default,
                        'audit_report_meta.default.',
                        resource_meta[index].key
                      )}
                      <br />
                      {resource_meta[index]?.child_meta &&
                        resource_meta[index].value > 0 &&
                        Object.keys(resource_meta[index]?.child_meta).map((meta_key, key) => (
                          <div className="d-flex justify-content-between" key={key}>
                            <span>
                              {defaultNameCheck(t, true, 'audit_report_meta.default.', meta_key)}
                            </span>
                            <span>{tsNumbers(resource_meta[index].child_meta[meta_key])}</span>
                          </div>
                        ))}
                    </td>
                    <td className="text-end">{tsNumbers(resource_meta[index].value)}</td>
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
            <td>{tsNumbers(surplus_value.total_capitals.total)}</td>
            <td></td>
            <td>{t('audit_report_meta.default.total')}</td>
            <td>{tsNumbers(surplus_value.total_resource.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
