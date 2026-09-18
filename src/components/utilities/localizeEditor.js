// Quill 1's toolbar and tooltip do not expose a locale API. Decorate only this
// editor's generated labels; retain all format values, content and handlers.
export default function localizeEditor(editor, t, label) {
  const toolbar = editor.getModule('toolbar').container
  const container = editor.container.parentElement
  const tooltip = container.querySelector('.ql-tooltip')
  const text = (key, options) => t(`localization.shared.editor.${key}`, options)
  const setAttribute = (element, name, value) => {
    if (element && element.getAttribute(name) !== value) element.setAttribute(name, value)
  }
  const optionLabel = (type, value) => {
    if (type === 'header') return value ? text('heading', { number: value }) : text('normal')
    if (type === 'size') return text(value || 'normal')
    if (type === 'font') return text(value || 'sans_serif')
    if (type === 'align') return text(`align_${value || 'left'}`)
    return text('color_option', { type: text(type), color: value || text('default_color') })
  }
  const update = () => {
    toolbar.querySelectorAll('button').forEach((button) => {
      const type = [...button.classList].find((name) => name.startsWith('ql-'))?.slice(3)
      const value = button.getAttribute('value')
      let key = type
      if (type === 'list' || type === 'script') key = `${type}_${value}`
      if (type === 'indent') key = value === '-1' ? 'indent_minus' : 'indent_plus'
      const name = type === 'image' ? t('common.image') : text(key)
      setAttribute(button, 'aria-label', name)
      setAttribute(button, 'title', name)
    })
    toolbar.querySelectorAll('.ql-picker').forEach((picker) => {
      const type = [...picker.classList]
        .find((name) =>
          ['ql-header', 'ql-size', 'ql-font', 'ql-align', 'ql-color', 'ql-background'].includes(
            name
          )
        )
        ?.slice(3)
      if (!type) return
      picker.querySelectorAll('.ql-picker-label, .ql-picker-item').forEach((item) => {
        const name = optionLabel(type, item.getAttribute('data-value'))
        setAttribute(item, 'data-label', name)
        setAttribute(
          item,
          'aria-label',
          item.classList.contains('ql-picker-label') ? `${text(type)}: ${name}` : name
        )
        setAttribute(item, 'title', name)
      })
    })
    toolbar.querySelectorAll('select').forEach((select) => {
      const type = [...select.classList].find((name) => name.startsWith('ql-'))?.slice(3)
      setAttribute(select, 'aria-label', text(type))
      select.querySelectorAll('option').forEach((option) => {
        const value = option.getAttribute('value') || ''
        // A missing value falls back to textContent in HTML; pin its original
        // empty format value before translating the display text.
        if (!option.hasAttribute('value')) option.setAttribute('value', value)
        const name = optionLabel(type, value)
        if (option.textContent !== name) option.textContent = name
      })
    })
    if (tooltip) {
      const mode = tooltip.getAttribute('data-mode') || 'link'
      setAttribute(tooltip.querySelector('input'), 'aria-label', text(`enter_${mode}`))
      setAttribute(tooltip.querySelector('.ql-preview'), 'aria-label', text('link'))
      setAttribute(
        tooltip.querySelector('.ql-action'),
        'aria-label',
        t(tooltip.classList.contains('ql-editing') ? 'common.save' : 'common.edit')
      )
      setAttribute(tooltip.querySelector('.ql-remove'), 'aria-label', text('remove_link'))
    }
  }
  setAttribute(
    editor.root,
    'aria-label',
    typeof label === 'string' ? label : t('common.description')
  )
  for (const [property, value] of Object.entries({
    'visit-link': text('visit_link'),
    'enter-link': text('enter_link'),
    'enter-formula': text('enter_formula'),
    'enter-video': text('enter_video'),
    edit: t('common.edit'),
    save: t('common.save'),
    remove: text('remove_link')
  }))
    container.style.setProperty(`--editor-${property}`, JSON.stringify(value))
  update()
  const observer = new MutationObserver(update)
  observer.observe(toolbar, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-value', 'class']
  })
  if (tooltip)
    observer.observe(tooltip, { attributes: true, attributeFilter: ['class', 'data-mode'] })
  return () => observer.disconnect()
}
