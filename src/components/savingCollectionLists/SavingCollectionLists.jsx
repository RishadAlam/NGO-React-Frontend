import { useMemo } from 'react'
import { useTable } from 'react-table'

export default function SavingCollectionLists() {
  const columns = useMemo(
    () => [
      { Header: '#', accessor: 'id' },
      { Header: 'First Name', accessor: 'firstName' },
      { Header: 'Last Name', accessor: 'lastName' }
    ],
    []
  )

  const data = useMemo(
    () => [
      {
        id: 1,
        firstName: 'Mehmet',
        lastName: 'Baran'
      },
      {
        id: 2,
        firstName: 'Mehmet',
        lastName: 'Baran'
      },
      {
        id: 2,
        firstName: 'Mehmet',
        lastName: 'Baran'
      }
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  })

  return (
    <>
      <div className="table-responsive">
        <table {...getTableProps()} className="table table-hover table-report">
          <thead>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th key={index} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => (
                    <td key={index} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
