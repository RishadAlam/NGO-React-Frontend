import Cards from '../../components/dashboardCards/Cards'
import './dashboard.scss'

export default function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="box shadow pie-analytics">Pie Box</div>
        <div className="box shadow box-card">
          <Cards cardName={'Loan Given'} amount={'72137'} compAmount={-5} />
        </div>
        <div className="box shadow box-card">
          <Cards cardName={'Loan Recovered'} amount={'3453'} compAmount={3} />
        </div>
        <div className="box shadow top-collectionist">top</div>
        <div className="box shadow box-card">
          <Cards cardName={'Loan Saving Collection'} amount={'2323123'} compAmount={-6} />
        </div>
        <div className="box shadow box-card">
          <Cards cardName={'Saving Collection'} amount={'233422'} compAmount={2} />
        </div>
        <div className="box shadow collection-list">analytics1</div>
        <div className="box shadow pie-analytics">Pie Box2</div>
        <div className="box shadow collection-list">analytics2</div>
        <div className="box shadow withdrawal-list">bar1</div>
        <div className="box shadow withdrawal-list">bar2</div>
      </div>
    </>
  )
}
