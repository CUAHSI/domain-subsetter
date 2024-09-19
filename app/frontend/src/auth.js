import { ENDPOINTS, APP_URL } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useAlertStore } from './stores/alerts'
import { fetchWrapper } from '@/_helpers/fetchWrapper'

export async function logIn(callback) {
  const alertStore = useAlertStore()
  const authStore = useAuthStore()
  const response = await fetchWrapper.get(ENDPOINTS.authCuahsiAuthorize)
  if (!response?.ok) {
    displayError(`error getting ${ENDPOINTS.authCuahsiAuthorize}`)
    return
  }
  const json = await response.unpacked
  // alter redirect uri
  const authUrl = new URL(json.authorization_url)
  // TODO: use an env var for auth redirect instead of hard-coding
  // "#" hash routing was not passed from github env secret so had to hard code here.
  authUrl.searchParams.set('redirect_uri', `${APP_URL}#/auth-redirect`)
  window.open(
    authUrl.toString(),
    '_blank',
    'location=1, status=1, scrollbars=1, width=800, height=800'
  )
  window.addEventListener('message', async (event) => {
    if (!APP_URL.includes(event.origin)) {
      return
    }

    const params = event.data

    const url = `${ENDPOINTS.authCuahsiCallback}${params}`
    const resp = await fetchWrapper.get(url)

    if (!resp.ok) {
      console.log(resp.status, resp.statusText)
      displayError(`error getting ${url}`)
      return
    }
    const json = await resp.unpacked
    authStore.login(json)

    const response = await fetchWrapper.get(ENDPOINTS.userInfo)
    if (response.ok) {
      const userinfo = await response.unpacked
      authStore.user = userinfo
      // router.push({ name: 'map' })
      alertStore.displayAlert({
        title: 'Logged in',
        text: 'You have successfully logged in',
        type: 'success',
        closable: true,
        duration: 3
      })
      callback?.()
    } else {
      console.error(response.status, response.statusText)
      displayError(`error getting ${ENDPOINTS.userInfo}`)
      return
    }
    event.source.close()
  })
}

export async function logOut(callback) {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()
  authStore.logout()
  // TODO: logout endpoint
  // await fetch(ENDPOINTS.logout, { method: 'POST', credentials: 'include', mode: 'cors' })
  alertStore.displayAlert({
    title: 'Logged out',
    text: 'You have successfully logged out',
    type: 'success',
    closable: true,
    duration: 3
  })
  callback?.()
}

async function displayError(text) {
  text = text || 'We had difficulty logging you in. If you continue to encounter this issue, please contact help@cuahsi.org.'
  const alertStore = useAlertStore()
  alertStore.displayAlert({
    title: 'Error Logging In',
    text: text,
    type: 'error',
    closable: true,
    duration: 3
  })
}
