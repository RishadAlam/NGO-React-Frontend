import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useIsAuthorizedValue } from '../../atoms/authAtoms'
import { useIsLoadingValue } from '../../atoms/loaderAtoms'
import './layout.scss'

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAutorized = useIsAuthorizedValue()
  const isLoading = useIsLoadingValue()

  useEffect(() => {
    if (!isAutorized) navigate('login', { state: { from: location }, replace: false })
  }, [isAutorized])

  //   if (isLoading) {
  //   return <div>loading...</div>
  // }

  return (
    <>
      {isAutorized && (
        <section className="main">
          <div className="d-flex">
            <div className="side-bar d-md-block d-none">SideBar</div>
            <div className="main-body">
              <div className="top-bar">TopBar</div>
              <div className="content">content</div>
            </div>
          </div>
          <div className="footer">footer</div>
        </section>
      )}
    </>
  )
}
