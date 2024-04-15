import 'react-lazy-load-image-component/src/effects/blur.css'
import useFetch from '../../hooks/useFetch'
import tsNumbers from '../../libs/tsNumbers'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import Avatar from '../utilities/Avatar'
import './topCollectors.scss'

export default function TopCollectors({ heading }) {
  const { data: { data = [] } = [], isLoading } = useFetch({
    action: 'collection/current-day-top-collectionist'
  })

  return (
    <div className="topBox">
      {isLoading ? (
        <ReactTableSkeleton />
      ) : (
        <div className="card">
          <div className="card-header">
            <h1>{heading}</h1>
          </div>
          <div className="card-body">
            <div className="list">
              {Array.isArray(data) &&
                data.map((user) => (
                  <div className="listItem" key={user.id}>
                    <div className="user">
                      <Avatar name={user.name} img={user.image_uri} />
                      <div className="userTexts">
                        <span className="username">{user.name}</span>
                        <span className="role">{user.email}</span>
                      </div>
                    </div>
                    <span className="amount">৳ {tsNumbers(user.amount)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
