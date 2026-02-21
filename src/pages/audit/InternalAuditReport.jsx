import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import Loader from '../../components/loaders/Loader'
import useFetch from '../../hooks/useFetch'
import AuditIcon from '../../icons/AuditIcon'
import AuditReportIcon from '../../icons/AuditReportIcon'
import Home from '../../icons/Home'
import tsNumbers from '../../libs/tsNumbers'
import '../staffs/staffs.scss'
import './internalAuditReport.scss'

const toAmount = (value = 0) => Number(value || 0)
const money = (value = 0) => tsNumbers(`$${toAmount(value)}/-`)
const isMismatch = (actual = 0, calculated = 0) =>
  Math.abs(toAmount(actual) - toAmount(calculated)) > 0.001
const toRecoveryPercentage = (recovered = 0, actual = 0) => {
  const actualAmount = toAmount(actual)
  if (actualAmount <= 0) return 0
  return (toAmount(recovered) / actualAmount) * 100
}

export default function InternalAuditReport() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    fieldId: '',
    centerId: ''
  })
  const [appliedFilters, setAppliedFilters] = useState({})
  const [filterError, setFilterError] = useState('')

  const { data: { data: fields = [] } = [] } = useFetch({ action: 'fields/active' })
  const centerQueryParams = useMemo(
    () => (filters.fieldId ? { field_id: filters.fieldId } : null),
    [filters.fieldId]
  )
  const { data: { data: centers = [] } = [] } = useFetch({
    action: 'centers/active',
    queryParams: centerQueryParams
  })

  const reportQueryParams = useMemo(
    () => (Object.keys(appliedFilters).length > 0 ? appliedFilters : null),
    [appliedFilters]
  )
  const {
    data: {
      data: {
        savingsByCategory = [],
        loanSavingsByCategory = [],
        loansByCategory = [],
        totals = {}
      } = {}
    } = {},
    isLoading,
    isError
  } = useFetch({
    action: 'audit/internal-report',
    queryParams: reportQueryParams
  })

  const reportErrorMessage = useMemo(() => {
    if (!isError) return ''
    if (typeof isError === 'string') return isError

    const firstKey = Object.keys(isError)[0]
    const firstValue = isError[firstKey]

    if (Array.isArray(firstValue)) return firstValue[0]
    return firstValue || t('audit_report_page.internal.messages.something_went_wrong')
  }, [isError, t])

  const hasAnyRows =
    savingsByCategory.length > 0 || loanSavingsByCategory.length > 0 || loansByCategory.length > 0

  const safeTotals = {
    totalSavingsDepositAll: toAmount(totals?.totalSavingsDepositAll),
    totalLoanSavingsAll: toAmount(totals?.totalLoanSavingsAll),
    totalAllSavingsCombined: toAmount(totals?.totalAllSavingsCombined),
    totalLoanRemainingAll: toAmount(totals?.totalLoanRemainingAll),
    profitLoss: toAmount(totals?.profitLoss)
  }

  const calculatedTotals = useMemo(() => {
    const totalSavingsDepositAll = savingsByCategory.reduce(
      (sum, item) => sum + toAmount(item?.totalSavingsDeposit),
      0
    )
    const totalLoanSavingsAll = loanSavingsByCategory.reduce(
      (sum, item) => sum + toAmount(item?.totalLoanSavings),
      0
    )
    const totalLoanRemainingAll = loansByCategory.reduce(
      (sum, item) => sum + toAmount(item?.totalLoanRemaining),
      0
    )
    const totalAllSavingsCombined = totalSavingsDepositAll + totalLoanSavingsAll
    const profitLoss = totalLoanRemainingAll - totalAllSavingsCombined

    return {
      totalSavingsDepositAll,
      totalLoanSavingsAll,
      totalAllSavingsCombined,
      totalLoanRemainingAll,
      profitLoss
    }
  }, [loanSavingsByCategory, loansByCategory, savingsByCategory])

  const loanSummaryTotals = useMemo(
    () =>
      loansByCategory.reduce(
        (acc, item) => {
          acc.totalLoanGivenActual += toAmount(item?.totalLoanGivenActual)
          acc.totalLoanRecovery += toAmount(item?.totalLoanRecovery)
          acc.totalLoanRemaining += toAmount(item?.totalLoanRemaining)
          acc.totalLoanGivenCalculated += toAmount(item?.totalLoanGivenCalculated)
          acc.totalInterestActual += toAmount(item?.totalInterestActual)
          acc.totalInterestRecovery += toAmount(item?.totalInterestRecovery)
          acc.totalInterestRemaining += toAmount(item?.totalInterestRemaining)
          acc.totalInterestCalculated += toAmount(item?.totalInterestCalculated)
          return acc
        },
        {
          totalLoanGivenActual: 0,
          totalLoanRecovery: 0,
          totalLoanRemaining: 0,
          totalLoanGivenCalculated: 0,
          totalInterestActual: 0,
          totalInterestRecovery: 0,
          totalInterestRemaining: 0,
          totalInterestCalculated: 0
        }
      ),
    [loansByCategory]
  )

  const isLoss = safeTotals.profitLoss < 0
  const formatPercent = (value = 0) =>
    t('audit_report_page.internal.values.percent', {
      value: tsNumbers(toAmount(value).toFixed(2))
    })

  const renderMatchBadge = (hasMismatch) => (
    <span className={`badge rounded-pill ${hasMismatch ? 'text-bg-danger' : 'text-bg-success'}`}>
      {hasMismatch
        ? t('audit_report_page.internal.badges.mismatch')
        : t('audit_report_page.internal.badges.ok')}
    </span>
  )

  const onFilterChange = (event) => {
    const { name, value } = event.target

    setFilters((prev) => {
      const nextState = { ...prev, [name]: value }
      if (name === 'fieldId') {
        nextState.centerId = ''
      }
      return nextState
    })

    setFilterError('')
  }

  const applyFilters = (event) => {
    event.preventDefault()

    if (filters.fromDate && filters.toDate && filters.fromDate > filters.toDate) {
      setFilterError(t('audit_report_page.internal.filters.date_range_error'))
      return
    }

    const nextFilters = {}

    if (filters.fromDate) nextFilters.fromDate = filters.fromDate
    if (filters.toDate) nextFilters.toDate = filters.toDate
    if (filters.fieldId) nextFilters.field_id = filters.fieldId
    if (filters.centerId) nextFilters.center_id = filters.centerId

    setAppliedFilters(nextFilters)
  }

  const resetFilters = () => {
    setFilters({ fromDate: '', toDate: '', fieldId: '', centerId: '' })
    setAppliedFilters({})
    setFilterError('')
  }

  const appliedFilterChips = useMemo(() => {
    const chips = []
    const selectedField = fields.find(
      (field) => String(field.id) === String(appliedFilters.field_id)
    )
    const selectedCenter = centers.find(
      (center) => String(center.id) === String(appliedFilters.center_id)
    )

    if (appliedFilters.fromDate) {
      chips.push(`${t('audit_report_page.internal.filters.from_date')}: ${appliedFilters.fromDate}`)
    }
    if (appliedFilters.toDate) {
      chips.push(`${t('audit_report_page.internal.filters.to_date')}: ${appliedFilters.toDate}`)
    }
    if (appliedFilters.field_id) {
      chips.push(`${t('common.field')}: ${selectedField?.name || appliedFilters.field_id}`)
    }
    if (appliedFilters.center_id) {
      chips.push(`${t('common.center')}: ${selectedCenter?.name || appliedFilters.center_id}`)
    }

    return chips
  }, [appliedFilters, centers, fields, t])

  return (
    <section className="staff internal-audit-report">
      <div className="my-3">
        <Breadcrumb
          breadcrumbs={[
            { name: t('menu.dashboard'), path: '/', icon: <Home size={16} />, active: false },
            { name: t('menu.label.audit'), icon: <AuditIcon size={16} />, active: false },
            {
              name: t('menu.audit.internal_audit_report'),
              icon: <AuditReportIcon size={20} />,
              active: true
            }
          ]}
        />
      </div>

      <div className="audit-page-header mb-3">
        <h1 className="page-title mb-1">{t('menu.audit.internal_audit_report')}</h1>
        <p className="page-subtitle mb-0">{t('audit_report_page.internal.ui.subtitle')}</p>
      </div>

      <div className="audit-layout">
        <aside className="audit-side">
          <div className="card mb-3 audit-filter-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 className="filter-title mb-0">
                  {t('audit_report_page.internal.ui.filters_title')}
                </h2>
                {appliedFilterChips.length > 0 ? (
                  <span className="badge rounded-pill text-bg-primary">
                    {t('audit_report_page.internal.ui.filters_applied')}
                  </span>
                ) : null}
              </div>

              <form className="row g-2 align-items-end" onSubmit={applyFilters}>
                <div className="col-12">
                  <label className="form-label mb-1">
                    {t('audit_report_page.internal.filters.from_date')}
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={onFilterChange}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label mb-1">
                    {t('audit_report_page.internal.filters.to_date')}
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={onFilterChange}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label mb-1">{t('common.field')}</label>
                  <select
                    name="fieldId"
                    value={filters.fieldId}
                    onChange={onFilterChange}
                    className="form-select">
                    <option value="">{t('audit_report_page.internal.filters.all_fields')}</option>
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label mb-1">{t('common.center')}</label>
                  <select
                    name="centerId"
                    value={filters.centerId}
                    onChange={onFilterChange}
                    className="form-select">
                    <option value="">{t('audit_report_page.internal.filters.all_centers')}</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 d-flex gap-2 filter-actions">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    {t('audit_report_page.internal.filters.apply')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={resetFilters}>
                    {t('audit_report_page.internal.filters.reset')}
                  </button>
                </div>
              </form>

              {filterError && <p className="text-danger mt-2">{filterError}</p>}

              <div className="applied-filters mt-3">
                <p className="title mb-2">{t('audit_report_page.internal.ui.applied_filters')}</p>
                {appliedFilterChips.length > 0 ? (
                  <div className="chips">
                    {appliedFilterChips.map((chip) => (
                      <span key={chip} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty mb-0">{t('audit_report_page.internal.ui.no_filters')}</p>
                )}
              </div>
            </div>
          </div>

          {!isLoading && !reportErrorMessage && hasAnyRows ? (
            <div className="audit-side-summary">
              <div className="side-summary-head">
                <h2 className="heading mb-1">
                  {t('audit_report_page.internal.ui.overview_title')}
                </h2>
                <p className="subheading mb-0">
                  {t('audit_report_page.internal.ui.overview_hint')}
                </p>
              </div>

              <div className="audit-metrics-grid side-metrics">
                <div className="audit-metric-card metric-savings">
                  <p className="label">
                    {t('audit_report_page.internal.cards.total_savings_deposit')}
                  </p>
                  <h4>{money(safeTotals.totalSavingsDepositAll)}</h4>
                </div>
                <div className="audit-metric-card metric-loan-savings">
                  <p className="label">
                    {t('audit_report_page.internal.cards.total_loan_savings')}
                  </p>
                  <h4>{money(safeTotals.totalLoanSavingsAll)}</h4>
                </div>
                <div className="audit-metric-card metric-combined">
                  <p className="label">
                    {t('audit_report_page.internal.cards.total_all_savings_combined')}
                  </p>
                  <h4>{money(safeTotals.totalAllSavingsCombined)}</h4>
                </div>
                <div className="audit-metric-card metric-remaining">
                  <p className="label">
                    {t('audit_report_page.internal.cards.total_loan_remaining')}
                  </p>
                  <h4>{money(safeTotals.totalLoanRemainingAll)}</h4>
                </div>
              </div>

              <div className="profit-hero-card side-profit-hero">
                <p className="hero-label mb-1">
                  {t('audit_report_page.internal.profit_loss.title')}
                </p>
                <h3 className={`hero-value mb-1 ${isLoss ? 'is-loss' : 'is-profit'}`}>
                  {money(safeTotals.profitLoss)}
                </h3>
                <span className={`hero-status ${isLoss ? 'is-loss' : 'is-profit'}`}>
                  {isLoss
                    ? t('audit_report_page.internal.profit_loss.loss')
                    : t('audit_report_page.internal.profit_loss.profit')}
                </span>
                <p className="hero-formula mb-0">
                  {t('audit_report_page.internal.profit_loss.formula')}
                </p>
              </div>
            </div>
          ) : null}
        </aside>

        <div className="audit-main">
          {isLoading ? (
            <div className="card">
              <div className="card-body">
                <Loader style={{ height: 220 }} />
              </div>
            </div>
          ) : reportErrorMessage ? (
            <div className="card">
              <div className="card-body">
                <p className="text-danger mb-0">{reportErrorMessage}</p>
              </div>
            </div>
          ) : !hasAnyRows ? (
            <div className="card">
              <div className="card-body">
                <p className="mb-0">{t('common.No_Records_Found')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="card mb-3 report-table audit-section-card">
                <div className="card-header">
                  <div className="section-head-row">
                    <div>
                      <h2 className="heading mb-1">
                        {t('audit_report_page.internal.sections.savings_summary')}
                      </h2>
                      <p className="subheading mb-0">
                        {t('audit_report_page.internal.sections.savings_summary_hint')}
                      </p>
                    </div>
                    <span className="section-pill">
                      {t('audit_report_page.internal.ui.categories_count', {
                        count: savingsByCategory.length
                      })}
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover table-report table-compact mb-0">
                      <thead>
                        <tr>
                          <th>{t('common.category')}</th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.total_savings_deposit')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {savingsByCategory.map((item) => (
                          <tr key={item.categoryId}>
                            <td>{item.categoryName}</td>
                            <td className="text-end">{money(item.totalSavingsDeposit)}</td>
                          </tr>
                        ))}
                        <tr className="table-total-row">
                          <td>{t('common.total')}</td>
                          <td className="text-end">{money(safeTotals.totalSavingsDepositAll)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card mb-3 report-table audit-section-card">
                <div className="card-header">
                  <div className="section-head-row">
                    <div>
                      <h2 className="heading mb-1">
                        {t('audit_report_page.internal.sections.loan_savings_summary')}
                      </h2>
                      <p className="subheading mb-0">
                        {t('audit_report_page.internal.sections.loan_savings_summary_hint')}
                      </p>
                    </div>
                    <span className="section-pill">
                      {t('audit_report_page.internal.ui.categories_count', {
                        count: loanSavingsByCategory.length
                      })}
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover table-report table-compact mb-0">
                      <thead>
                        <tr>
                          <th>{t('common.category')}</th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.total_loan_savings')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loanSavingsByCategory.map((item) => (
                          <tr key={item.categoryId}>
                            <td>{item.categoryName}</td>
                            <td className="text-end">{money(item.totalLoanSavings)}</td>
                          </tr>
                        ))}
                        <tr className="table-total-row">
                          <td>{t('common.total')}</td>
                          <td className="text-end">{money(safeTotals.totalLoanSavingsAll)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card mb-3 report-table audit-section-card loan-summary-card">
                <div className="card-header">
                  <div className="section-head-row">
                    <div>
                      <h2 className="heading mb-1">
                        {t('audit_report_page.internal.sections.loan_summary')}
                      </h2>
                      <p className="subheading mb-0">
                        {t('audit_report_page.internal.sections.loan_summary_hint')}
                      </p>
                    </div>
                    <span className="section-pill">
                      {t('audit_report_page.internal.ui.categories_count', {
                        count: loansByCategory.length
                      })}
                    </span>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover table-report table-loan-summary mb-0">
                      <thead>
                        <tr>
                          <th rowSpan="2">{t('common.category')}</th>
                          <th colSpan="6" className="text-center group-header">
                            {t('audit_report_page.internal.columns.principal_group')}
                          </th>
                          <th colSpan="6" className="text-center group-header">
                            {t('audit_report_page.internal.columns.interest_group')}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.loan_given_actual')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.loan_recovery')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.loan_recovery_percentage')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.loan_remaining')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.loan_given_calculated')}
                          </th>
                          <th className="text-center">
                            {t('audit_report_page.internal.columns.loan_check')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.interest_actual')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.interest_recovery')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.interest_recovery_percentage')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.interest_remaining')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.columns.interest_calculated')}
                          </th>
                          <th className="text-center">
                            {t('audit_report_page.internal.columns.interest_check')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loansByCategory.map((item) => (
                          <tr key={item.categoryId}>
                            <td>{item.categoryName}</td>
                            <td className="text-end">{money(item.totalLoanGivenActual)}</td>
                            <td className="text-end">{money(item.totalLoanRecovery)}</td>
                            <td className="text-end">
                              {formatPercent(
                                toRecoveryPercentage(
                                  item.totalLoanRecovery,
                                  item.totalLoanGivenActual
                                )
                              )}
                            </td>
                            <td className="text-end">{money(item.totalLoanRemaining)}</td>
                            <td className="text-end">{money(item.totalLoanGivenCalculated)}</td>
                            <td className="text-center">{renderMatchBadge(item.loanMismatch)}</td>
                            <td className="text-end">{money(item.totalInterestActual)}</td>
                            <td className="text-end">{money(item.totalInterestRecovery)}</td>
                            <td className="text-end">
                              {formatPercent(
                                toRecoveryPercentage(
                                  item.totalInterestRecovery,
                                  item.totalInterestActual
                                )
                              )}
                            </td>
                            <td className="text-end">{money(item.totalInterestRemaining)}</td>
                            <td className="text-end">{money(item.totalInterestCalculated)}</td>
                            <td className="text-center">
                              {renderMatchBadge(item.interestMismatch)}
                            </td>
                          </tr>
                        ))}
                        <tr className="table-total-row">
                          <td>{t('common.total')}</td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalLoanGivenActual)}
                          </td>
                          <td className="text-end">{money(loanSummaryTotals.totalLoanRecovery)}</td>
                          <td className="text-end">
                            {formatPercent(
                              toRecoveryPercentage(
                                loanSummaryTotals.totalLoanRecovery,
                                loanSummaryTotals.totalLoanGivenActual
                              )
                            )}
                          </td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalLoanRemaining)}
                          </td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalLoanGivenCalculated)}
                          </td>
                          <td className="text-center">-</td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalInterestActual)}
                          </td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalInterestRecovery)}
                          </td>
                          <td className="text-end">
                            {formatPercent(
                              toRecoveryPercentage(
                                loanSummaryTotals.totalInterestRecovery,
                                loanSummaryTotals.totalInterestActual
                              )
                            )}
                          </td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalInterestRemaining)}
                          </td>
                          <td className="text-end">
                            {money(loanSummaryTotals.totalInterestCalculated)}
                          </td>
                          <td className="text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card mb-3 report-table audit-section-card profit-breakdown-card">
                <div className="card-header">
                  <h2 className="heading mb-1">
                    {t('audit_report_page.internal.sections.profit_reconciliation')}
                  </h2>
                  <p className="subheading mb-0">
                    {t('audit_report_page.internal.sections.profit_reconciliation_hint')}
                  </p>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <p className="breakdown-title mb-2">
                      {t('audit_report_page.internal.profit_loss.breakdown_title')}
                    </p>
                    <table className="table table-hover table-report table-breakdown mb-0">
                      <thead>
                        <tr>
                          <th>{t('audit_report_page.internal.profit_loss.breakdown_label')}</th>
                          <th className="text-end">
                            {t('audit_report_page.internal.profit_loss.api_total')}
                          </th>
                          <th className="text-end">
                            {t('audit_report_page.internal.profit_loss.calculated_total')}
                          </th>
                          <th className="text-center">
                            {t('audit_report_page.internal.profit_loss.check')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {t('audit_report_page.internal.profit_loss.rows.total_loan_remaining')}
                          </td>
                          <td className="text-end">{money(safeTotals.totalLoanRemainingAll)}</td>
                          <td className="text-end">
                            {money(calculatedTotals.totalLoanRemainingAll)}
                          </td>
                          <td className="text-center">
                            {renderMatchBadge(
                              isMismatch(
                                safeTotals.totalLoanRemainingAll,
                                calculatedTotals.totalLoanRemainingAll
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {t('audit_report_page.internal.profit_loss.rows.total_savings_deposit')}
                          </td>
                          <td className="text-end">{money(safeTotals.totalSavingsDepositAll)}</td>
                          <td className="text-end">
                            {money(calculatedTotals.totalSavingsDepositAll)}
                          </td>
                          <td className="text-center">
                            {renderMatchBadge(
                              isMismatch(
                                safeTotals.totalSavingsDepositAll,
                                calculatedTotals.totalSavingsDepositAll
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {t('audit_report_page.internal.profit_loss.rows.total_loan_savings')}
                          </td>
                          <td className="text-end">{money(safeTotals.totalLoanSavingsAll)}</td>
                          <td className="text-end">
                            {money(calculatedTotals.totalLoanSavingsAll)}
                          </td>
                          <td className="text-center">
                            {renderMatchBadge(
                              isMismatch(
                                safeTotals.totalLoanSavingsAll,
                                calculatedTotals.totalLoanSavingsAll
                              )
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {t(
                              'audit_report_page.internal.profit_loss.rows.total_all_savings_combined'
                            )}
                          </td>
                          <td className="text-end">{money(safeTotals.totalAllSavingsCombined)}</td>
                          <td className="text-end">
                            {money(calculatedTotals.totalAllSavingsCombined)}
                          </td>
                          <td className="text-center">
                            {renderMatchBadge(
                              isMismatch(
                                safeTotals.totalAllSavingsCombined,
                                calculatedTotals.totalAllSavingsCombined
                              )
                            )}
                          </td>
                        </tr>
                        <tr className="table-total-row">
                          <td>{t('audit_report_page.internal.profit_loss.rows.profit_loss')}</td>
                          <td className="text-end">{money(safeTotals.profitLoss)}</td>
                          <td className="text-end">{money(calculatedTotals.profitLoss)}</td>
                          <td className="text-center">
                            {renderMatchBadge(
                              isMismatch(safeTotals.profitLoss, calculatedTotals.profitLoss)
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
