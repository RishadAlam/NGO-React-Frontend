import React from 'react'
import { useTranslation } from 'react-i18next'

export default function SavingCollectionSheetHead({ columnList }) {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        <th className={`${!columnList['#'] ? 'd-none' : ''}`}>#</th>
        <th className={`${!columnList.image ? 'd-none' : ''}`}>{t('common.image')}</th>
        <th className={`${!columnList.name ? 'd-none' : ''}`}>{t('common.name')}</th>
        <th className={`${!columnList.acc_no ? 'd-none' : ''}`}>{t('common.acc_no')}</th>
        <th className={`${!columnList.description ? 'd-none' : ''}`}>{t('common.description')}</th>
        <th className={`${!columnList.deposit ? 'd-none' : ''}`}>{t('common.deposit')}</th>
        <th className={`${!columnList.creator ? 'd-none' : ''}`}>{t('common.creator')}</th>
        <th className={`${!columnList.time ? 'd-none' : ''}`}>{t('common.time')}</th>
        <th className={`${!columnList.action ? 'd-none' : ''}`}>{t('common.action')}</th>
      </tr>
    </thead>
  )
}
