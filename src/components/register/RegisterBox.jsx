import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import CheckPatch from '../../icons/CheckPatch'
import Clock from '../../icons/Clock'
import Dollar from '../../icons/Dollar'
import Trash from '../../icons/Trash'
import UserCheck from '../../icons/UserCheck'
import TabPanel from '../utilities/TabPanel'

export default function RegisterBox() {
  const [registerTabValue, setRegisterTabValue] = useState(1)

  return (
    <>
      <div className="register-box shadow rounded-4 rounded-bottom-3 p-3 pb-0 overflow-hidden">
        <div className="row pb-3 mt-2">
          <div className="col-md-4 d-flex flex-1 px2 align-items-center justify-content-center justify-content-lg-start">
            <div className="image-preview border shadow rounded-4 p-2">
              <div className="img" style={{ width: '150px', height: '150px' }}>
                <img
                  className="rounded-2"
                  alt="image"
                  src="https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                  style={{ width: 'inherit', height: 'inherit', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="ms-3">
              <div className="truncate text-wrap fw-medium ln-hight">
                <b>Name</b>
              </div>
              <div className="truncate text-wrap fw-medium ln-hight">
                <b>Account No:</b> acc_no{' '}
              </div>
            </div>
          </div>
          <div className="col-md-4 px-3 middle-column">
            <div className="truncate fw-medium">
              <b>Details Summary</b>
            </div>
            <div className="d-flex flex-column justify-content-center mt-4">
              <div className="truncate text-wrap d-flex align-items-center">
                <i data-feather="rss" className="w-4 h-4 me-2"></i>
                <b className="me-2">Volume:</b>
                $account volume name
              </div>
              <div className="truncate text-wrap d-flex align-items-center mt-3">
                <i data-feather="target" className="w-4 h-4 me-2"></i>
                <b className="me-2">Center:</b>
                $account center name
              </div>
              <div className="truncate text-wrap d-flex align-items-center mt-3">
                <i data-feather="phone" className="w-4 h-4 me-2"></i>
                <b className="me-2">Phone:</b>
                $account mobile
              </div>
              <div className="truncate text-wrap d-flex align-items-center mt-3">
                <i data-feather="calendar" className="w-4 h-4 me-2"></i>
                <b className="me-2">Registration:</b>
                date('d M, Y', strtotime($account created_at))
              </div>
              <div className="truncate text-wrap d-flex align-items-center mt-3">
                <i data-feather="dollar-sign" className="w-4 h-4 me-2"></i>
                <b className="me-2">Share:</b>৳ $account share /-
              </div>
            </div>
          </div>
          <div className="col-md-4 px-3">
            <div className="row align-items-center justify-content-center px-3">
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 2 </div>
                <div className="text-gray-600">Running Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 0 </div>
                <div className="text-gray-600">pending Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 4 </div>
                <div className="text-gray-600">Hold Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 1 </div>
                <div className="text-gray-600">Closed Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 2 </div>
                <div className="text-gray-600">Running Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 0 </div>
                <div className="text-gray-600">pending Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 4 </div>
                <div className="text-gray-600">Hold Saving Account</div>
              </div>
              <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
                <div className="fw-medium text-primary fs-xl"> 1 </div>
                <div className="text-gray-600">Closed Saving Account</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-top">
          <Tabs
            value={registerTabValue}
            onChange={(e, value) => setRegisterTabValue(value)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile>
            <Tab
              label="&nbsp; Register Account"
              value={1}
              icon={<UserCheck />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Running Savings Account"
              value={2}
              icon={<Dollar />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Pending Savings Account"
              value={3}
              icon={<CheckPatch />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Hold Savings Account"
              value={4}
              icon={<Clock />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Closed Saving Account"
              value={5}
              icon={<Trash />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Running Loan Account"
              value={6}
              icon={<Dollar />}
              iconPosition="start"
            />
            <Tab
              label="&nbsp; Pending Loan Account"
              value={7}
              icon={<CheckPatch />}
              iconPosition="start"
            />
            <Tab label="&nbsp; Hold Loan Account" value={8} icon={<Clock />} iconPosition="start" />
            <Tab
              label="&nbsp; Closed Loan Account"
              value={8}
              icon={<Trash />}
              iconPosition="start"
            />
          </Tabs>
        </div>
      </div>

      <TabPanel value={registerTabValue} index={1}>
        <div className="register-box shadow rounded-4 rounded-top-3 mt-3 p-3 overflow-hidden">
          Item One
        </div>
      </TabPanel>
      <TabPanel value={registerTabValue} index={2}>
        <div className="register-box shadow rounded-4 rounded-top-3 mt-3 p-3 overflow-hidden">
          Item Two
        </div>
      </TabPanel>
      <TabPanel value={registerTabValue} index={3}>
        <div className="register-box shadow rounded-4 rounded-top-3 mt-3 p-3 overflow-hidden">
          Item Three
        </div>
      </TabPanel>
    </>
  )
}
