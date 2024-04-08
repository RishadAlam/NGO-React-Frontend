import { useAppSettingsValue } from '../../atoms/appSettingsAtoms'

export default function ReportLayout({ title, desc, children }) {
  const { company_name } = useAppSettingsValue()

  return (
    <div className="mb-5">
      <div className="report-header text-center">
        <h3>{company_name}</h3>
        {title && <h5>{title}</h5>}
        <h5>{desc}</h5>
      </div>
      <div className="report-body mt-2 mb-5">{children}</div>
      <div className="report-footer">
        <div className="pt-5 d-flex justify-content-between">
          <h4>সম্পাদক</h4>
          <h4>সভাপতি</h4>
          <h4>অডিট অফিসার</h4>
        </div>
      </div>
    </div>
  )
}
