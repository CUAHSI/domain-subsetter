import { useAuthStore } from '@/stores/auth'
import { API_BASE } from '@/constants'
import { useAlertStore } from '@/stores/alerts'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
}

function request(method) {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url)
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    console.log('url', url, 'options', requestOptions)
    try {
      let resp = await fetch(url, requestOptions)
      return handleResponse(resp)
    } catch (e) {
      const alertStore = useAlertStore()
      alertStore.displayAlert({
        title: 'Error with request',
        text: `Encountered an issue connection to ${url}: ${e}`,
        type: 'error',
        closable: true,
        duration: 6
      })
      console.error(e)
    }
  }
}

// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const authStore = useAuthStore()
  const jwt = authStore.getToken()
  const isLoggedIn = !!jwt
  const isApiUrl = url.startsWith(API_BASE)
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${jwt}` }
  } else {
    console.log(`Isapi:${isApiUrl} isloggedin:${isLoggedIn}`)
    return {}
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      // const { user, logout } = useAuthStore();
      // if ([401, 403].includes(response.status) && user) {
      //     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      //     logout();
      // }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
