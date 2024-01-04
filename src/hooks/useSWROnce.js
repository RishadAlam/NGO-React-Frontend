import { useEffect } from 'react'
import useSWRImmutable from 'swr/immutable'
import bitsFetch from '../Utils/bitsFetch'
import { isVarEmpty } from '../helper/isVarEmpty'

const checkData = (data) => data?.success && !data?.data?.errors && !isVarEmpty(data.data)

const useSWROnce = (key, urlData, options = {}) => {
  const shouldFetch = 'fetchCondition' in options ? options.fetchCondition : true
  const swrKey = shouldFetch ? key : null

  const swrData = useSWRImmutable(
    swrKey,
    (url) => {
      const resp = bitsFetch(urlData, Array.isArray(url) ? url[0] : url)
      if (options.onLoading && swrData.isLoading) {
        options.onLoading()
      }
      return resp
    },
    {
      ...options,
      onSuccess: (data) => options.onSuccess && checkData(data) && options.onSuccess(data.data)
    }
  )

  useEffect(() => {
    if (!checkData(swrData.data)) return
    const { data } = swrData.data
    if (options.onMount) {
      options.onMount(data)
    } else if (options.onSuccess) {
      options.onSuccess(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return swrData
}

export default useSWROnce
