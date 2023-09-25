import AlertTriangle from '../../../icons/AlertTriangle'

export default function ErrorFallback({ error }) {
  return (
    <div
      className="alert alert-danger d-flex align-items-center justify-content-center"
      role="alert">
      <AlertTriangle size={30} />
      &nbsp;&nbsp;
      <div>{error.message || 'Somethin went wrong!'}</div>
    </div>
  )
}
