import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { useAuthDataValue } from '../atoms/authAtoms'
import xFetch from '../utilities/xFetch'

export default function useFetch({ action, method = 'GET', requestData = null }) {
  const navigate = useNavigate()
  const { accessToken } = useAuthDataValue()
  const { data, error, mutate, isLoading } = useSWR(action, (uri) =>
    xFetch(uri, requestData, null, accessToken, null, method)
  )

  if (data?.status === 403 && data?.message === 'This action is unauthorized.') {
    return navigate('/unauthorized')
  }

  return {
    data,
    mutate,
    isLoading,
    isError: error
  }
}
