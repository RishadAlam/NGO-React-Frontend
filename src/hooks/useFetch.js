import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { useAuthDataValue } from '../atoms/authAtoms'
import xFetch from '../utilities/xFetch'

export default function useFetch({
  action,
  method = 'GET',
  requestData = null,
  queryParams = null
}) {
  const navigate = useNavigate()
  const { accessToken } = useAuthDataValue()
  const { data, error, mutate, isLoading } = useSWR(
    [action, queryParams ? JSON.stringify(queryParams) : null],
    (uri) =>
      xFetch(Array.isArray(uri) ? uri[0] : uri, requestData, null, accessToken, queryParams, method)
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
