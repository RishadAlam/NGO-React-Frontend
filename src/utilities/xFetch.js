import axios from 'axios'

export default async function xFetch(
  endpoint,
  data,
  signal = null,
  accessToken = null,
  queryParam = null,
  method = 'GET'
) {
  const uri = new URL(`/api/${endpoint}`, import.meta.env.VITE_BASE_URI)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  // Build Config
  const config = {
    method: method.toUpperCase(),
    url: uri,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'en'
    }
  }

  if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
    config.data = data instanceof FormData ? data : JSON.stringify(data)
  }
  if (accessToken) {
    config.headers.Authorization = accessToken
  }
  if (signal) {
    config.signal = signal
  }

  const response = await axios(config)
    .then((res) => {
      // console.log(res.data)
      return res.data
    })
    .catch((errors) => {
      if (errors.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(errors.response.data)
        // console.log(errors.response.status)
        // console.log(errors.response.headers)
        return errors.response.data
      } else if (errors.request) {
        // The request was made but no response was received
        // `errors.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return errors.request
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', errors.message)
        return { success: false, errors: { message: errors.message } }
      }
    })

  return response
}
