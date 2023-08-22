import { MaterialReactTable } from 'material-react-table';
import { useMemo } from 'react';

export default function SavingCollectionLists() {
    const data = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    country: "abcd",
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    country: "abcd",
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
    country: "abcd",
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
    country: "abcd",
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
    country: "abcd",
  },
];


  const columns = useMemo(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
    //   enableColumnActions={false}
    //   enableColumnFilters={false}
    //   enablePagination={false}
    //   enableSorting={false}
    //   enableBottomToolbar={false}
    //   enableTopToolbar={false}
    //   muiTableBodyRowProps={{ hover: false }}
    //   muiTableProps={{
    //     sx: {
    //       border: '1px solid rgba(81, 81, 81, 1)',
    //     },
    //   }}
    //   muiTableHeadCellProps={{
    //     sx: {
    //       border: '1px solid rgba(81, 81, 81, 1)',
    //     },
    //   }}
    //   muiTableBodyCellProps={{
    //     sx: {
    //       border: '1px solid rgba(81, 81, 81, 1)',
    //     },
    //   }}
    />
  )
}
