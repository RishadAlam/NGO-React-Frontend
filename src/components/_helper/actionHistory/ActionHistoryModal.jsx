import React from 'react'
import XCircle from '../../../icons/XCircle'
import Avatar from '../../utilities/Avatar'
import Button from '../../utilities/Button'
import ModalPro from '../../utilities/ModalPro'
import './actionHistoryModal.scss'

export default function ActionHistoryModal({ open, setOpen, t }) {
  return (
    <>
      <ModalPro open={open} handleClose={() => setOpen(false)}>
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <b className="text-uppercase">Action History</b>
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
                <div className="historyBox position-relative">
                  <div className="avatar">
                    <Avatar
                      name={'test'}
                      img="https://cdn.dribbble.com/users/5261465/screenshots/14119359/media/18da3dea3d48c5d1cf5c0b5a00cc00fd.jpg?resize=1000x750&vertical=center"
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="heading py-1 px-5">
                      <b>Delete</b>
                    </div>
                    <div className="date text-end">
                      <p>20/20/2010</p>
                      <b>Danial Grot</b>
                    </div>
                  </div>
                  <div className="details p-3 mt-2">
                    <ul className="m-0 p-0">
                      <li>yieryiwue</li>
                      <li>yieryiwue</li>
                      <li>yieryiwue</li>
                      <li>yieryiwue</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPro>
    </>
  )
}
