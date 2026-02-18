import { create } from 'mutative'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultNameCheck } from '../../helper/defaultNameCheck'
import useFetch from '../../hooks/useFetch'
import Save from '../../icons/Save'
import tsNumbers from '../../libs/tsNumbers'
import Button from '../utilities/Button'
import CategoryConfigRow from './CategoryConfigRow'
import './categoriesConfig.scss'

function CategoryConfig({
  allConfigurations,
  setAllConfigurations,
  error,
  setError,
  update,
  loading
}) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [dirtyCategoryIds, setDirtyCategoryIds] = useState([])
  const { data: { data: accounts = [] } = [] } = useFetch({ action: 'accounts/active' })
  const VIRTUAL_ITEM_HEIGHT = 56
  const VIRTUAL_LIST_HEIGHT = 520
  const VIRTUAL_BUFFER = 8

  const setChange = (val, name, index) => {
    const categoryId = allConfigurations[index]?.id

    setAllConfigurations((prevConfig) =>
      create(prevConfig, (draftConfig) => {
        if (
          name === 's_reg_fee_acc_id' ||
          name === 's_col_fee_acc_id' ||
          name === 'l_reg_fee_acc_id' ||
          name === 'l_col_fee_acc_id' ||
          name === 's_with_fee_acc_id' ||
          name === 'ls_with_fee_acc_id'
        ) {
          const tmpAcc = `${name.slice(0, name.indexOf('acc_id'))}account`
          draftConfig[index][tmpAcc] = val
          draftConfig[index][name] = val?.id || 0
          return
        }

        if ((val !== '' && Number(val) === 0) || val === false || (val?.length || 0) > 8) {
          val = 0
        }

        draftConfig[index][name] = val
      })
    )

    if (categoryId) {
      setDirtyCategoryIds((prevIds) =>
        prevIds.includes(categoryId) ? prevIds : [...prevIds, categoryId]
      )
    }

    setError((prevErr) =>
      create(prevErr, (draftErr) => {
        delete draftErr.message
        if (val === '') {
          draftErr[name] = true
        } else {
          delete draftErr[name]
        }
      })
    )
  }

  const categoryItems = useMemo(
    () =>
      allConfigurations.map((config, configIndex) => ({
        id: config.id,
        configIndex,
        name: defaultNameCheck(
          t,
          config?.category?.is_default,
          'category.default.',
          config?.category?.name || ''
        )
      })),
    [allConfigurations, t]
  )

  const filteredCategoryItems = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    if (!normalizedQuery) return categoryItems

    return categoryItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
  }, [categoryItems, searchQuery])

  const hasValidationError = Object.keys(error || {}).some((errKey) => errKey !== 'message')
  const selectedConfig =
    typeof selectedConfigIndex === 'number' ? allConfigurations[selectedConfigIndex] || null : null
  const selectedCategoryId = selectedConfig?.id || null
  const dirtyCount = dirtyCategoryIds.length

  const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_ITEM_HEIGHT) - VIRTUAL_BUFFER)
  const visibleCount = Math.ceil(VIRTUAL_LIST_HEIGHT / VIRTUAL_ITEM_HEIGHT) + VIRTUAL_BUFFER * 2
  const endIndex = Math.min(filteredCategoryItems.length, startIndex + visibleCount)
  const visibleCategoryItems = filteredCategoryItems.slice(startIndex, endIndex)
  const totalListHeight = filteredCategoryItems.length * VIRTUAL_ITEM_HEIGHT

  useEffect(() => {
    if (!filteredCategoryItems.length) {
      setSelectedConfigIndex(null)
      return
    }

    if (
      selectedConfigIndex === null ||
      !filteredCategoryItems.some((item) => item.configIndex === selectedConfigIndex)
    ) {
      setSelectedConfigIndex(filteredCategoryItems[0].configIndex)
    }
  }, [filteredCategoryItems, selectedConfigIndex])

  useEffect(() => {
    if (!allConfigurations.length) {
      setDirtyCategoryIds([])
      setSelectedConfigIndex(null)
    }
  }, [allConfigurations.length])

  const onUpdateClick = async (event) => {
    const success = await update(event)
    if (success) {
      setDirtyCategoryIds([])
    }
  }

  return (
    <div className="card mx-auto categories-config-modern">
      <div className="card-header">
        <div>
          <p className="categories-config-kicker mb-1">{t('menu.label.settings_and_privacy')}</p>
          <h4 className="mb-1">{t('menu.settings_and_privacy.categories_config')}</h4>
          <p className="categories-config-description mb-0">
            {t('categories_config.page_description')}
          </p>
        </div>

        <div className="categories-config-header-meta">
          <span>{t('staff_permissions.group_name.category')}</span>
          <strong>
            {tsNumbers(`${filteredCategoryItems.length}/${allConfigurations.length}`)}
          </strong>
        </div>
      </div>

      <div className="card-body">
        {error?.message && error?.message !== '' && (
          <div className="alert alert-danger mb-3" role="alert">
            <strong>{error?.message}</strong>
          </div>
        )}

        <div className="categories-config-workspace">
          <aside className="categories-config-sidebar">
            <div className="categories-config-sidebar-header">
              <h6>{t('categories_config.list_title')}</h6>
              <small>{t('categories_config.list_hint')}</small>

              <div className="categories-config-toolbar categories-config-toolbar--sidebar">
                <label className="mb-0" htmlFor="categories-config-search">
                  {t('categories_config.search_category')}
                </label>
                <input
                  id="categories-config-search"
                  type="text"
                  className="form-control"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setScrollTop(0)
                  }}
                  placeholder={t('categories_config.search_category_placeholder')}
                  disabled={loading}
                />
              </div>
            </div>

            {filteredCategoryItems.length > 0 ? (
              <div
                className="categories-config-virtual-list"
                style={{ maxHeight: `${VIRTUAL_LIST_HEIGHT}px` }}
                onScroll={(event) => setScrollTop(event.target.scrollTop)}>
                <div
                  className="categories-config-virtual-list-inner"
                  style={{ height: `${totalListHeight}px` }}>
                  {visibleCategoryItems.map((item, offset) => {
                    const absoluteIndex = startIndex + offset
                    const isSelected = item.configIndex === selectedConfigIndex
                    const isDirty = dirtyCategoryIds.includes(item.id)

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`category-list-item ${isSelected ? 'category-list-item--active' : ''}`}
                        style={{
                          top: `${absoluteIndex * VIRTUAL_ITEM_HEIGHT}px`,
                          height: `${VIRTUAL_ITEM_HEIGHT - 6}px`
                        }}
                        onClick={() => setSelectedConfigIndex(item.configIndex)}>
                        <span className="category-list-item-name">{item.name}</span>
                        <span className="category-list-item-meta">
                          #{tsNumbers(item.configIndex + 1)}
                          {isDirty ? ' •' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="categories-config-empty">
                {t('categories_config.no_categories_found')}
              </div>
            )}
          </aside>

          <section className="categories-config-editor">
            {selectedConfig ? (
              <CategoryConfigRow
                key={selectedCategoryId}
                config={selectedConfig}
                index={selectedConfigIndex}
                accounts={accounts}
                setChange={setChange}
                loading={loading}
                error={error}
              />
            ) : (
              <div className="categories-config-editor-empty">
                <p>{t('categories_config.select_category_prompt')}</p>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="card-footer categories-config-footer">
        <div>
          <p className="mb-1">{t('categories_config.review_before_update')}</p>
          <small>
            {dirtyCount
              ? t('categories_config.pending_changes_count', { count: tsNumbers(dirtyCount) })
              : t('categories_config.no_pending_changes')}
          </small>
        </div>
        <Button
          type="button"
          name={t('common.update')}
          className={'btn-primary py-2 px-4'}
          loading={loading || false}
          endIcon={<Save size={20} />}
          onclick={(e) => onUpdateClick(e)}
          disabled={hasValidationError || loading || dirtyCount === 0}
        />
      </div>
    </div>
  )
}

export default memo(CategoryConfig)
