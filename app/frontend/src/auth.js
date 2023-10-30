import { ENDPOINTS, APP_URL } from '@/constants'
import { useAuthStore } from '@/stores/auth'
// import { Notifications } from '@cznethub/cznet-vue-core'
// function openLogInDialog(redirectTo) {
//     this.logInDialog$.next(redirectTo);
//   }

export async function logIn(callback) {
  const response = await fetch(ENDPOINTS.authCuahsiAuthorize)
  const json = await response.json()

  // alter redirect uri
  const authUrl = new URL(json.authorization_url)
  // const originalRedirect = authUrl.searchParams.get('redirect_uri')
  authUrl.searchParams.set('redirect_uri', `${APP_URL}/auth-redirect`)
  window.open(
    authUrl.toString(),
    '_blank',
    'location=1, status=1, scrollbars=1, width=800, height=800'
  )
  window.addEventListener('message', async (event) => {
    if (event.origin !== APP_URL) {
      return
    }

    const params = new URLSearchParams(event.data)
    const url = `${ENDPOINTS.authCuahsiCallback}?${params}`
    await fetch(url, {credentials: 'include', mode: 'cors'})
    
    let userInfo = await fetch(`${ENDPOINTS.userInfo}`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
    userInfo = await userInfo.json()

    const authStore = useAuthStore();
    authStore.login(userInfo)
    callback?.()
  })
}
