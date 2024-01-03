import { IconButton } from '@mui/joy'
import { Tooltip, Zoom } from '@mui/material'
import { memo } from 'react'
import Edit from '../../icons/Edit'
import Trash from '../../icons/Trash'
import dateFormat from '../../libs/dateFormat'
import tsNumbers from '../../libs/tsNumbers'
import ActionBtnGroup from '../utilities/ActionBtnGroup'
import Avatar from '../utilities/Avatar'

function SavingCollectionSheetRow({ columnList, index, account, collection = {} }) {
  const actionBtnGroup = (id) => (
    <ActionBtnGroup>
      <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
        <IconButton className="text-warning" onClick={() => console.log(`${id}`)}>
          {<Edit size={20} />}
        </IconButton>
      </Tooltip>
      {!id && (
        <Tooltip TransitionComponent={Zoom} title="Edit" arrow followCursor>
          <IconButton className="text-danger" onClick={() => console.log(`${id}`)}>
            {<Trash size={20} />}
          </IconButton>
        </Tooltip>
      )}
    </ActionBtnGroup>
  )

  return (
    <tr>
      <td className={`${!columnList['#'] ? 'd-none' : ''}`}>
        {index && tsNumbers((index + 1).toString().padStart(2, '0'))}
      </td>
      <td className={`${!columnList.image ? 'd-none' : ''}`}>
        <Avatar
          name={account?.client_registration?.name}
          img={account?.client_registration?.image_uri}
        />
      </td>
      <td className={`${!columnList.name ? 'd-none' : ''}`}>
        {account?.client_registration?.name}
      </td>
      <td className={`${!columnList.acc_no ? 'd-none' : ''}`}>{tsNumbers(account?.acc_no)}</td>
      <td className={`${!columnList.description ? 'd-none' : ''}`}>{collection?.description}</td>
      <td className={`${!columnList.deposit ? 'd-none' : ''}`}>
        {collection?.deposit && tsNumbers(`$${collection?.deposit}/-`)}
      </td>
      <td className={`${!columnList.creator ? 'd-none' : ''}`}>{collection?.author?.name}</td>
      <td className={`${!columnList.time ? 'd-none' : ''}`}>
        {collection?.created_at &&
          tsNumbers(dateFormat(collection?.created_at, 'dd/MM/yyyy hh:mm a'))}
      </td>
      <td className={`${!columnList.action ? 'd-none' : ''}`}>
        {actionBtnGroup(collection?.id || null)}
      </td>
    </tr>
  )
}

export default memo(SavingCollectionSheetRow)
