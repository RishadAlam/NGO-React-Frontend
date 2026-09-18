import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Breadcrumb({ breadcrumbs }) {
  const { t } = useTranslation()
  return (
    <div role="presentation">
      <Breadcrumbs aria-label={t('localization.shared.breadcrumb')}>
        {breadcrumbs.map((breadcrumb, key) =>
          !breadcrumb.active ? (
            <Link
              key={key}
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              to={breadcrumb.path}>
              <div className="d-flex align-items-center">
                {breadcrumb.icon}
                &nbsp;
                {breadcrumb.name}
              </div>
            </Link>
          ) : (
            <Typography
              key={key}
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary">
              <span className="d-flex align-items-center">
                {breadcrumb.icon}
                &nbsp;
                {breadcrumb.name}
              </span>
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  )
}
