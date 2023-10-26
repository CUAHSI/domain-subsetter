import { ENDPOINTS, APP_URL } from '@/constants'
// import { Notifications } from '@cznethub/cznet-vue-core'
import { getQueryString } from "@/util";
// function openLogInDialog(redirectTo) {
//     this.logInDialog$.next(redirectTo);
//   }

export async function logIn(callback) {
  const response = await fetch(ENDPOINTS.authCuahsiAuthorize)
  const json = await response.json()

  // alter redirect uri
  const authUrl = new URL(json.authorization_url);
  const originalRedirect =  authUrl.searchParams.get('redirect_uri')
  authUrl.searchParams.set('redirect_uri', `${APP_URL}/auth-redirect`);

  window.open(
    authUrl.toString(),
    '_blank',
    'location=1, status=1, scrollbars=1, width=800, height=800'
  )
  window.addEventListener('message', async (event) => {
    if (
      event.origin !== APP_URL ||
      !event.data.hasOwnProperty("state")
    ) {
      alert("bad event")
      console.log("data", event.data)
      console.log("origin", event.origin)
      return;
    }

    if (event.data.state) {
      alert('logged in')
      // TODO: fetch with data to originalRedirect to get JWT
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
