import { useTranslation } from 'react-i18next'
import 'react-lazy-load-image-component/src/effects/blur.css'
import tsNumbers from '../../libs/tsNumbers'
import ReactTableSkeleton from '../loaders/skeleton/ReactTableSkeleton'
import Avatar from '../utilities/Avatar'
import './topCollectors.scss'

export default function TopCollectors({ heading, collectors, isLoading }) {
  const { t } = useTranslation()

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
              {Array.isArray(collectors) &&
                collectors.map((user) => (
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
              {!collectors.length && (
                <div className="d-flex align-items-center justify-content-center">
                  <p>{t('common.No_Records_Found')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
