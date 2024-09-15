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
    console.log(`Sending ${method} request to ${url}`)
    try {
      let resp = await fetch(url, requestOptions)
      return handleResponse(resp)
    } catch (e) {
      console.error(e)
      // return a response object
      return {ok: false, message: e}
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

/**
 * Handles the response from an API request.
 *
 * @param {Response} response - The response object from the API request.
 * @returns {Promise<any>} - A promise that resolves to the parsed data from the response.
 * @throws {string} - Throws an error message if the response is not successful.
 */
function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text)

    if (!response.ok) {
      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          const alertStore = useAlertStore()
          alertStore.displayAlert({
            title: 'Unauthorized',
            text: `You have been logged out due to inactivity. Please log in again.`,
            type: 'error',
            closable: true,
            duration: 6
          })
          console.error('Unauthorized request:', response)
          logout();
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    data.ok = true
    return data
  }).catch((error) => {
    return {ok: false, message: error}
  })
}
