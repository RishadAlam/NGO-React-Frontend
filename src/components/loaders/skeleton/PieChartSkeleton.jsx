import { Skeleton } from '@mui/material'
import { colors } from '../../../resources/staticData/colors'

export default function PieChartSkeleton() {
  return (
    <div className="pieChartBox">
      <div className="card">
        <div className="card-header">
          <Skeleton animation="wave" width={250} height={20} variant="text" />
        </div>
        <div className="card-body">
          <div className="chart">
            <Skeleton animation="wave" width={250} height={250} variant="circular" />
          </div>
          <div className="options d-flex flex-wrap mt-5">
            <div className="option">
              <div className="title">
                <div className="dot" style={{ backgroundColor: colors[1].hex }} />
                <Skeleton animation="wave" width={50} height={20} variant="text" />
              </div>
              <Skeleton animation="wave" width={50} height={15} variant="text" />
            </div>
            <div className="option">
              <div className="title">
                <div className="dot" style={{ backgroundColor: colors[2].hex }} />
                <Skeleton animation="wave" width={50} height={20} variant="text" />
              </div>
              <Skeleton animation="wave" width={50} height={15} variant="text" />
            </div>
            <div className="option">
              <div className="title">
                <div className="dot" style={{ backgroundColor: colors[3].hex }} />
                <Skeleton animation="wave" width={50} height={20} variant="text" />
              </div>
              <Skeleton animation="wave" width={50} height={15} variant="text" />
            </div>
            <div className="option">
              <div className="title">
                <div className="dot" style={{ backgroundColor: colors[4].hex }} />
                <Skeleton animation="wave" width={50} height={20} variant="text" />
              </div>
              <Skeleton animation="wave" width={50} height={15} variant="text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
