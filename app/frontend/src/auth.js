import { ENDPOINTS, APP_URL, OAUTH2_REDIRECT_URL } from '@/constants'
import { useAuthStore } from '@/stores/auth'
// import { fetchWrapper } from '@/_helpers/fetch-wrapper';
// function openLogInDialog(redirectTo) {
//     this.logInDialog$.next(redirectTo);
//   }

export async function logIn(callback) {
  const response = await fetch(ENDPOINTS.authCuahsiAuthorize)
  const json = await response.json()

  // alter redirect uri
  const authUrl = new URL(json.authorization_url)
  authUrl.searchParams.set('redirect_uri', OAUTH2_REDIRECT_URL)
  window.open(
    authUrl.toString(),
    '_blank',
    'location=1, status=1, scrollbars=1, width=800, height=800'
  )
  window.addEventListener('message', async (event) => {
    if ( !APP_URL.includes(event.origin)) {
      return
    }
    
    const params = event.data

    const url = `${ENDPOINTS.authCuahsiCallback}${params}`
    const resp =  await fetch(url)
    const json = await resp.json()
    const authStore = useAuthStore();
    authStore.login(json)

    // const userInfo = awaitw
    const userinfo = await fetch(ENDPOINTS.userInfo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${json.access_token}`,
      }
    })
    if (userinfo.ok){
      const result = await userinfo.json();
      authStore.user = result
      console.log(result)
      // await User.commit((state) => {
      //   state.isLoggedIn = true;
      //   state.accessToken = event.data.accessToken;
      // });
      // this.loggedIn$.next();
      // this.isLoginListenerSet = false;
      callback?.()
    }else{
      alert("error logging in")
    }
    event.source.close()
  })
}

export async function logOut(callback) {
  const authStore = useAuthStore();
  authStore.logout()
  await fetch(ENDPOINTS.logout, {method: 'POST', credentials: 'include', mode: 'cors'})
  callback?.()
}