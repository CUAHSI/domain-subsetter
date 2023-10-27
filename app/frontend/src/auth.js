import { ENDPOINTS, APP_URL, API_BASE } from '@/constants'
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
    if (event.origin !== APP_URL || !event.data.hasOwnProperty('state')) {
      return
    }

    if (event.data.state) {
      const params = new URLSearchParams(event.data)
      const url = `${API_BASE}/front-callback?${params}`
      // const url = `${originalRedirect}?${params}`
      const resp =  await fetch(url)
      const json = await resp.json()
      alert(`HERE IS YOUR TOKEN: ${JSON.stringify(json)}`)

      // TODO: JWT to object store
      // await User.commit((state) => {
      //   state.isLoggedIn = true;
      //   state.accessToken = event.data.accessToken;
      // });
      // this.loggedIn$.next();
      // this.isLoginListenerSet = false;
      callback?.()
    } else {
      alert('failed')
    }
  })
}
