import parse from 'html-react-parser'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import XCircle from '../../../icons/XCircle'
import dateFormat from '../../../libs/dateFormat'
import Avatar from '../../utilities/Avatar'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import './actionHistoryModal.scss'

export default function ActionHistoryModal({ open, setOpen, actionHistory }) {
  const { t } = useTranslation()

  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">{t('common.action_history.action_history')}</b>
              <Button
                className={'text-danger p-0'}
                loading={false}
                endIcon={<XCircle size={24} />}
                onclick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12">
                {actionHistory.length > 0 ? (
                  actionHistory.toReversed().map((history, index) => (
                    <Fragment key={index}>
                      <div className="historyBox position-relative">
                        <div className="avatar">
                          <Avatar
                            name={'test'}
                            img={history?.author ? history?.author?.image_uri : history.image_uri}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className={`heading py-1 px-5 ${
                              history.action_type === 'delete'
                                ? 'bg-danger'
                                : history.action_type === 'restore'
                                  ? 'bg-success'
                                  : ''
                            }`}>
                            <b className="text-capitalize text-white">
                              {t(`common.action_history.${history.action_type}`)}
                            </b>
                          </div>
                          <div className="date text-end">
                            <p>{dateFormat(history.created_at, 'dd/MM/yyyy hh:mm a')}</p>
                            <b className="text-capitalize">
                              {history?.author ? history?.author?.name : history.name}
                            </b>
                          </div>
                        </div>
                        {setActionDetails(history.action_details, history.action_type, t)}
                      </div>
                    </Fragment>
                  ))
                ) : (
                  <div
                    className="col-md-12 d-flex align-items-center justify-content-center"
                    style={{ height: '100px' }}>
                    <h4>{t('common.No_Records_Found')}</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalPro>
    </>
  )
}

const setActionDetails = (action_details, action_type, t) =>
  Object.keys(action_details).length > 0 && (
    <div className="details p-3">
      <ul className="m-0 p-0">
        {(action_type === 'update' || action_type === 'delete') &&
          Object.keys(action_details).map((dataKey, index) => (
            <li key={index} className="text-nowrap d-flex justify-content-between">
              {t(`common.${dataKey}`)} :{' '}
              {typeof action_details[dataKey] === 'string'
                ? parse(action_details[dataKey])
                : setActionDetails(action_details[dataKey], action_type, t)}
            </li>
          ))}
      </ul>
    </div>
  )
