import tsNumbers from '../../libs/tsNumbers'

export default function ProfitLoss({ expenses, incomes, profit_loss }) {
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
        {(expenses.length > incomes.length ? expenses : incomes).map((field, index) => (
          <tr key={index}>
            {index < expenses.length ? (
              <>
                <td className="text-center">{tsNumbers(index + 1)}</td>
                <td>{expenses[index].key}</td>
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
                <td>{incomes[index].key}</td>
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
            <td>{key}</td>
            <td>{tsNumbers(profit_loss.total_expenses[key])}</td>
            <td></td>
            <td>{Object.keys(profit_loss.total_incomes)[index]}</td>
            <td>
              {tsNumbers(profit_loss.total_incomes[Object.keys(profit_loss.total_incomes)[index]])}
            </td>
          </tr>
        ))}
      </tfoot>
    </table>
  )
}
