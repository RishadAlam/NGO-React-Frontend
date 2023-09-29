import { Skeleton } from '@mui/material'

export default function StaffPermissionSkeleton({ skeletonSize }) {
  return (
    <div className="card my-3">
      <div className="card-header">
        <b className="text-uppercase">
          <Skeleton animation="pulse" width={250} height={20} variant="text" />
        </b>
      </div>
      <div className="card-body py-0 px-2">
        <div className="row">
          {Array.apply(null, { length: skeletonSize }).map((val, index) => (
            <div key={index} className="col-lg-6 col-xxl-4 m-0 p-0 border border-1">
              <div className="card rounded-0 border-0">
                <div className="card-header rounded-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <b className="text-capitalize">
                      <Skeleton animation="pulse" width={200} height={20} variant="text" />
                    </b>
                    <Skeleton
                      sx={{ marginLeft: 'auto' }}
                      animation="pulse"
                      width={40}
                      height={20}
                      variant="text"
                    />
                  </div>
                </div>
                <div className="card-body">
                  <ul className="mb-0">
                    <li>
                      <div className="row mb-2 align-items-center">
                        <div className="col-10">
                          <h6>
                            <Skeleton animation="pulse" width={200} height={20} variant="text" />
                          </h6>
                        </div>
                        <div className="col-2 text-end text-success">
                          <Skeleton
                            sx={{ marginLeft: 'auto' }}
                            animation="pulse"
                            width={40}
                            height={20}
                            variant="text"
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row mb-2 align-items-center">
                        <div className="col-10">
                          <h6>
                            <Skeleton animation="pulse" width={200} height={20} variant="text" />
                          </h6>
                        </div>
                        <div className="col-2 text-end text-success">
                          <Skeleton
                            sx={{ marginLeft: 'auto' }}
                            animation="pulse"
                            width={40}
                            height={20}
                            variant="text"
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row mb-2 align-items-center">
                        <div className="col-10">
                          <h6>
                            <Skeleton animation="pulse" width={200} height={20} variant="text" />
                          </h6>
                        </div>
                        <div className="col-2 text-end text-success">
                          <Skeleton
                            sx={{ marginLeft: 'auto' }}
                            animation="pulse"
                            width={40}
                            height={20}
                            variant="text"
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row mb-2 align-items-center">
                        <div className="col-10">
                          <h6>
                            <Skeleton animation="pulse" width={200} height={20} variant="text" />
                          </h6>
                        </div>
                        <div className="col-2 text-end text-success">
                          <Skeleton
                            sx={{ marginLeft: 'auto' }}
                            animation="pulse"
                            width={40}
                            height={20}
                            variant="text"
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="row mb-2 align-items-center">
                        <div className="col-10">
                          <h6>
                            <Skeleton animation="pulse" width={200} height={20} variant="text" />
                          </h6>
                        </div>
                        <div className="col-2 text-end text-success">
                          <Skeleton
                            sx={{ marginLeft: 'auto' }}
                            animation="pulse"
                            width={40}
                            height={20}
                            variant="text"
                          />
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer text-center">
        <Skeleton
          animation="pulse"
          sx={{ margin: 'auto' }}
          width={100}
          height={40}
          variant="rounded"
        />
      </div>
    </div>
  )
}
