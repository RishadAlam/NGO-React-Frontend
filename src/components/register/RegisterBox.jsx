export default function RegisterBox() {
  return (
    <div className="register-box shadow rounded-4 p-3 overflow-hidden">
      <div className="row pb-3 my-2 border-bottom">
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
              <div className="fw-medium text-primary fs-xl"> $totalActiveSavings </div>
              <div className="text-gray-600">Active Saving Accounts</div>
            </div>
            <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
              <div className="fw-medium text-primary fs-xl"> $totalDeactiveSavings </div>
              <div className="text-gray-600">Deactive Saving Accounts</div>
            </div>
            <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
              <div className="fw-medium text-primary fs-xl"> $totalActiveLoans </div>
              <div className="text-gray-600">Active Loan Accounts</div>
            </div>
            <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
              <div className="fw-medium text-primary fs-xl"> $totalDeactiveLoans </div>
              <div className="text-gray-600">Deactive Loan Accounts</div>
            </div>
            <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
              <div className="fw-medium text-primary fs-xl"> $totalDeactiveLoans </div>
              <div className="text-gray-600">Deactive Loan Accounts</div>
            </div>
            <div className="col-lg-4 col-sm-3 col-6 text-center rounded-2 py-3">
              <div className="fw-medium text-primary fs-xl"> $totalDeactiveLoans </div>
              <div className="text-gray-600">Deactive Loan Accounts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
