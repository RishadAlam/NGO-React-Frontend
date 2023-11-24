import Cookies from 'js-cookie'

export default function tsNumbers(numbers, en = false) {
  const lang = Cookies.get('i18next')
  const bn_to_en = {
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9',
    '০': '0'
  }
  const en_to_bn = {
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯',
    0: '০'
  }

  return lang !== 'bn' || en
    ? String(numbers).replace(/[১২৩৪৫৬৭৮৯০]/g, function (e) {
        return bn_to_en[e]
      })
    : String(numbers).replace(/[1234567890]/g, function (e) {
        return en_to_bn[e]
      })
}
