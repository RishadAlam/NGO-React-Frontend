import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import profilePlaceholder from '../../resources/placeholderImg/profilePlaceholder.webp'
import './topCollectors.scss'

export default function TopCollectors({ heading }) {
  const topDealUsers = [
    {
      id: 1,
      img: 'https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load',
      username: 'Elva McDonald',
      email: 'elva@gmail.com',
      amount: '3.668'
    },
    {
      id: 2,
      img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Linnie Nelson',
      email: 'linnie@gmail.com',
      amount: '3.256'
    },
    {
      id: 3,
      img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Brent Reeves',
      email: 'brent@gmail.com',
      amount: '2.998'
    },
    {
      id: 4,
      img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Adeline Watson',
      email: 'adeline@gmail.com',
      amount: '2.512'
    },
    {
      id: 5,
      img: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Juan Harrington',
      email: 'juan@gmail.com',
      amount: '2.134'
    },
    {
      id: 6,
      img: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Augusta McGee',
      email: 'augusta@gmail.com',
      amount: '1.932'
    },
    {
      id: 7,
      img: 'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=1600',
      username: 'Angel Thomas',
      email: 'angel@gmail.com',
      amount: '1.560'
    }
  ]

  return (
    <div className="topBox">
      <div className="card">
        <div className="card-header">
          <h1>{heading}</h1>
        </div>
        <div className="card-body">
          <div className="list">
            {topDealUsers.map((user) => (
              <div className="listItem" key={user.id}>
                <div className="user">
                  {/* <img src={user.img} alt="" /> */}
                  <LazyLoadImage
                    src={user.img}
                    width="100%"
                    height="100%"
                    placeholderSrc={profilePlaceholder}
                    effect="blur"
                    alt="User"
                  />
                  <div className="userTexts">
                    <span className="username">{user.username}</span>
                    <span className="role">{user.email}</span>
                  </div>
                </div>
                <span className="amount">৳ {user.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
