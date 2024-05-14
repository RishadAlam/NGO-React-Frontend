import { Skeleton } from '@mui/material'
import '../../dashboardCards/cards.scss'

export default function CardSkeleton() {
  return (
    <div className="cardBox">
      <div className="boxInfo">
        <div className="title">
          <Skeleton animation="wave" width={70} height={20} variant="text" />
        </div>
        <Skeleton animation="wave" width={60} height={30} variant="rounded" />
        <Skeleton animation="wave" width={50} height={25} variant="text" />
      </div>
      <div className="cardInfo">
        <div className="chart ms-auto">
          <Skeleton animation="wave" width={120} height={80} variant="rounded" />
        </div>
        <div className="texts ms-auto">
          <Skeleton animation="wave" width={50} height={25} variant="text" />
          <Skeleton animation="wave" width={50} height={20} variant="text" />
        </div>
      </div>
    </div>
  )
}
