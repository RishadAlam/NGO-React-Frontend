export const setCollectionBG = (el, valueToComp, value) => {
  valueToComp = Number(valueToComp || 0)
  value = Number(value || 0)

  if (el && value > 0) {
    if (value < valueToComp) {
      el.style.setProperty('background-color', '#dc3545', 'important')
    } else if (value > valueToComp) {
      el.style.setProperty('background-color', '#198754', 'important')
    }
  }
}
