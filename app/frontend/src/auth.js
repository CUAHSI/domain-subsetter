import { ENDPOINTS, APP_URL } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useAlertStore } from './stores/alerts'

export async function logIn(callback) {
  const alertStore = useAlertStore()
  const authStore = useAuthStore()
  const response = await fetch(ENDPOINTS.authCuahsiAuthorize)
  const json = await response.json()

  // alter redirect uri
  const authUrl = new URL(json.authorization_url)
  // TODO: use an env var for auth redirect instead of hard-coding
  // "#" hash routing was not passed from github env secret so had to hard code here.
  authUrl.searchParams.set('redirect_uri', `${APP_URL}/#/auth-redirect`)
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
    const resp = await fetch(url)
    const json = await resp.json()
    authStore.login(json)

    // const userInfo = awaitw
    const userinfo = await fetch(ENDPOINTS.userInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${json.access_token}`
      }
    })
    if (userinfo.ok) {
      const result = await userinfo.json()
      authStore.user = result
      alertStore.displayAlert({
        title: 'Logged in',
        text: 'You have successfully logged in',
        type: 'success',
        closable: true,
        duration: 3
      })
      callback?.()
    } else {
      alert('error logging in')
    }
    event.source.close()
  })
}

export async function logOut(callback) {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()
  authStore.logout()
  await fetch(ENDPOINTS.logout, { method: 'POST', credentials: 'include', mode: 'cors' })
  alertStore.displayAlert({
    title: 'Logged out',
    text: 'You have successfully logged out',
    type: 'success',
    closable: true,
    duration: 3
  })
  callback?.()
}
