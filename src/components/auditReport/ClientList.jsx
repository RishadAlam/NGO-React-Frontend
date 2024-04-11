import { useTranslation } from 'react-i18next'
import tsNumbers from '../../libs/tsNumbers'

export default function ClientList({
  client_list,
  total_shares,
  total_savings,
  total_loan_remaining
}) {
  const { t } = useTranslation()

  return (
    <table className="table table-bordered table-light client-list">
      <thead>
        <tr className="text-center">
          <th style={{ width: '8%' }}>ক্র/নং</th>
          <th style={{ width: '12%' }}>সদস্য নং</th>
          <th style={{ width: '30%' }}>নাম</th>
          <th style={{ width: '10%' }}>শেয়ার</th>
          <th style={{ width: '20%' }}>সঞ্চয়</th>
          <th style={{ width: '20%' }}>ঋণ পাওনা</th>
        </tr>
      </thead>
      <tbody style={{ border: 'none' }}>
        {client_list.map((client, index) => (
          <tr key={index}>
            <td className="text-center">{tsNumbers(index + 1)}</td>
            <td className="text-center">{tsNumbers(client.id)}</td>
            <td>{client.name}</td>
            <td className="text-end">{client.share > 0 ? tsNumbers(client.share) : null}</td>
            <td className="text-end">{client.savings > 0 ? tsNumbers(client.savings) : null}</td>
            <td className="text-end">
              {client.loan_remaining > 0 ? tsNumbers(client.loan_remaining) : null}
            </td>
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
        <tr>
          <td></td>
          <td></td>
          <td>{t('common.total')}</td>
          <td>{tsNumbers(total_shares)}</td>
          <td>{tsNumbers(total_savings)}</td>
          <td>{tsNumbers(total_loan_remaining)}</td>
        </tr>
      </tfoot>
    </table>
  )
}
