import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useId } from 'react'
import tsNumbers from '../../../libs/tsNumbers'

export default function ShowingRows({ pageSize, setPageSize, t }) {
  const labelId = useId()

  return (
    <>
      <FormControl className="showing-rows-control" variant="standard">
        <InputLabel id={labelId}>{t('common.Showing_Up')}</InputLabel>
        <Select
          labelId={labelId}
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          MenuProps={{
            PaperProps: {
              className: 'showing-rows-menu__paper'
            },
            MenuListProps: {
              className: 'showing-rows-menu__list'
            }
          }}
          label={t('common.Showing_Up')}>
          <MenuItem value={10}>{tsNumbers(10)}</MenuItem>
          <MenuItem value={20}>{tsNumbers(20)}</MenuItem>
          <MenuItem value={30}>{tsNumbers(30)}</MenuItem>
          <MenuItem value={50}>{tsNumbers(50)}</MenuItem>
          <MenuItem value={100}>{tsNumbers(100)}</MenuItem>
          <MenuItem value={500}>{tsNumbers(500)}</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}
