export default function AccountSummary() {
  return (
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
            <div className="blue-magenta">
              {' '}
              <h5>2</h5>{' '}
            </div>
            <div>
              <small>Running Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>0</h5>{' '}
            </div>
            <div>
              <small>pending Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>4</h5>{' '}
            </div>
            <div>
              <small>Hold Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>1</h5>{' '}
            </div>
            <div>
              <small>Closed Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>2</h5>{' '}
            </div>
            <div>
              <small>Running Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>0</h5>{' '}
            </div>
            <div>
              <small>pending Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>4</h5>{' '}
            </div>
            <div>
              <small>Hold Saving Account</small>
            </div>
          </div>
          <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
            <div className="blue-magenta">
              {' '}
              <h5>1</h5>{' '}
            </div>
            <div>
              <small>Closed Saving Account</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
