import './dashboard.scss'

export default function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="box pie-analytics">Pie Box</div>
        <div className="box box-card">Chart1</div>
        <div className="box box-card">Chart2</div>
        <div className="box top-collectionist">top</div>
        <div className="box box-card">Chart3</div>
        <div className="box box-card">Chart4</div>
        <div className="box collection-list">analytics1</div>
        <div className="box pie-analytics">Pie Box2</div>
        <div className="box collection-list">analytics2</div>
        <div className="box withdrawal-list">bar1</div>
        <div className="box withdrawal-list">bar2</div>
      </div>
    </>
  )
}
