export const setCollectionBG = (el, valueToComp, value) => {
  if (el && value > 0) {
    if (value < valueToComp) {
      el.style.setProperty('background-color', '#dc3545', 'important')
    } else if (value > valueToComp) {
      el.style.setProperty('background-color', '#198754', 'important')
    }
  }
}
