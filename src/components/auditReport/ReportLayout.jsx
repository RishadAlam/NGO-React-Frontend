import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'

export default function ReportLayout({ title, desc, children }) {
  const { company_name } = useAppSettingsValue()

  return (
    <div style={{ pageBreakAfter: 'always' }}>
      <div className="report-header text-center">
        <h3>{company_name}</h3>
        {title && <h5>{title}</h5>}
        <h5>{desc}</h5>
      </div>
      <div className="report-body mt-2 pb-5">{children}</div>
      <div className="report-footer pt-5">
        <div className="d-flex justify-content-between">
          <h4>সম্পাদক</h4>
          <h4>সভাপতি</h4>
          <h4>অডিট অফিসার</h4>
        </div>
      </div>
    </div>
  )
}
