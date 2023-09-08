import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import PrimaryBtn from '../../components/utilities/PrimaryBtn'
import Home from '../../icons/Home'
import Logout from '../../icons/Logout'

export default function Staffs() {
  return (
    <>
      <section className="staff">
        <div className="row align-items-center my-3">
          <div className="col-sm-6">
            <Breadcrumb
              breadcrumbs={[
                { name: 'Home', path: '/', icon: <Home size={16} />, active: false },
                { name: 'Staff', icon: <Home size={16} />, active: true }
              ]}
            />
          </div>
          <div className="col-sm-6 text-end">
            {/* <Button variant="contained" endIcon={<Logout />} style={{ background: 'red' }}>
              Create Staff
            </Button> */}
            <PrimaryBtn name={'Create Staff'} loading={false} endIcon={<Logout />} />
          </div>
        </div>
      </section>
    </>
  )
}
