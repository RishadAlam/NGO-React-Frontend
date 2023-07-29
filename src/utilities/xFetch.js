import axios from 'axios'

// export async function xFetch(endpoint, data, queryParam = null, method = 'GET') {
//   const uri = new URL(`/api/${endpoint}`, import.meta.env.VITE_BASE_URI)
//   // append query params in url
//   if (queryParam) {
//     for (const key in queryParam) {
//       if (key) {
//         uri.searchParams.append(key, queryParam[key])
//       }
//     }
//   }

//   //   const options = {
//   //     method,
//   //     headers: {
//   //       Accept: 'application/json',
//   //       'Content-Type': 'application/json',
//   //       'Accept-Language': 'en'
//   //     }
//   //   }

//   //   if (method.toLowerCase() === 'post') {
//   //     options.body = data instanceof FormData ? data : JSON.stringify(data)
//   //   }
//   //   const response = await fetch(uri, options)
//   //     .then((res) => res.text())
//   //     .then((res) => {
//   //       try {
//   //         console.log(res)
//   //         return JSON.parse(res)
//   //       } catch (error) {
//   //         const parsedRes = res.match(/{"success":(?:[^{}]*)*}/)
//   //         return parsedRes ? JSON.parse(parsedRes[0]) : { success: false, data: res }
//   //       }
//   //     })

//   const response = await axios
//     .post(uri, JSON.stringify(data), {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Accept-Language': 'en'
//       }
//     })
//     .then((res) => {
//       console.log(res.data)
//     })
//     .catch((errors) => {
//       if (errors.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(errors.response.data)
//         console.log(errors.response.status)
//         console.log(errors.response.headers)
//       } else if (errors.request) {
//         // The request was made but no response was received
//         // `errors.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(errors.request)
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', errors.message)
//       }
//       console.log(errors.config)
//     })

//   return response
// }

export async function postRequest(endpoint, data, queryParam = null) {
  const uri = new URL(`/api/${endpoint}`, import.meta.env.VITE_BASE_URI)
  const body = data instanceof FormData ? data : JSON.stringify(data)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const response = await axios
    .post(uri, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'bn'
      }
    })
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

export async function putRequest(endpoint, data, queryParam = null) {
  const uri = new URL(`/api/${endpoint}`, import.meta.env.VITE_BASE_URI)
  const body = data instanceof FormData ? data : JSON.stringify(data)
  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }

  const response = await axios
    .put(uri, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': 'bn'
      }
    })
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
