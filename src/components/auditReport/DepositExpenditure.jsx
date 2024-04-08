import tsNumbers from '../../libs/tsNumbers'

export default function DepositExpenditure({ depositMeta, expenditureMeta, deposit_expenditure }) {
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
                  <td>{depositMeta[index].key}</td>
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
                  <td>{expenditureMeta[index].key}</td>
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
            <td>{key}</td>
            <td>{tsNumbers(deposit_expenditure.total_collections[key])}</td>
            <td></td>
            <td>{Object.keys(deposit_expenditure.total_distributions)[index]}</td>
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
