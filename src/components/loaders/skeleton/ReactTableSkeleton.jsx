import { Skeleton } from '@mui/material'
import React from 'react'

export default function ReactTableSkeleton() {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <Skeleton animation="wave" width={250} height={20} variant="text" />
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <Skeleton animation="wave" width={80} height={30} variant="rounded" />
            </div>
            <div className="col-sm-6 text-end">
              <Skeleton
                sx={{ marginLeft: 'auto' }}
                animation="wave"
                width={200}
                height={30}
                variant="rounded"
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-report">
              <thead>
                <tr>
                  <th>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </th>
                  <th>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </th>
                  <th>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </th>
                  <th>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                  <td>
                    <Skeleton animation="wave" width={'100%'} height={20} variant="text" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
