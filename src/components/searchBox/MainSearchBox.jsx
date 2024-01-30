import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthDataValue } from '../../atoms/authAtoms'
import { isEmpty } from '../../helper/isEmpty'
import { isEmptyArray } from '../../helper/isEmptyObject'
import Search from '../../icons/Search'
import debounce from '../../libs/debounce'
import tsNumbers from '../../libs/tsNumbers'
import xFetch from '../../utilities/xFetch'
import Button from '../utilities/Button'
import './searchBox.scss'

export default function MainSearchBox({ t }) {
  const navigate = useNavigate()
  const { accessToken } = useAuthDataValue()
  const [searchData, setSearchData] = useState([])

  const liveSearch = debounce((e) => {
    if (isEmpty(e.target.value)) {
      setSearchData([])
      return
    }

    xFetch('client/registration', null, null, accessToken, {
      search: tsNumbers(e.target.value, true),
      limit: 10
    })
      .then((response) => {
        if (response?.success) {
          setSearchData(response.data)
          return
        }
      })
      .catch((errResponse) => {
        if (!errResponse?.errors) {
          toast.error(errResponse?.message)
        }
      })
  }, 500)

  const submit = (e) => {
    e.preventDefault()
    const data = searchData
    setSearchData([])
    navigate('/search', { state: { searchData: data } })
  }

  return (
    <>
      <div className="mainSearchBox position-relative">
        <form onSubmit={submit}>
          <input
            type="text"
            className="form-control form-input"
            placeholder={t('common.search_placeholder')}
            name="search"
            onKeyUp={liveSearch}
          />
          <span className="left-pan">
            <Button name={<Search size={20} />} disabled={false} loading={false} type="submit" />
          </span>
        </form>
        {!isEmptyArray(searchData) && (
          <div className={`search-box-dropdown position-absolute rounded-5`}>
            <ul className="mb-0 p-3 shadow rounded">
              {searchData.map((account) => (
                <li key={account.id} className="pb-3 border-bottom">
                  <Link to={`/client-register/${account.id}`} onClick={() => setSearchData([])}>
                    <div className="dropdown-info">
                      <b className="pe-2 border-end">{tsNumbers(account.acc_no)}</b>
                      <small className="ms-2 text-nowrap">{account.name}</small>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
