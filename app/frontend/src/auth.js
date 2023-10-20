// import { APP_URL, CLIENT_ID, ENDPOINTS } from "@/constants";
import { ENDPOINTS } from "@/constants";
// function openLogInDialog(redirectTo) {
//     this.logInDialog$.next(redirectTo);
//   }

  export async function logIn(callback) {
    // const params = {
    //   response_type: "token",
    //   client_id: `${CLIENT_ID}`,
    //   redirect_uri: `${APP_URL}/auth-redirect`,
    //   window_close: "True",
    //   scope: "openid",
    // };

    console.log (ENDPOINTS.authCuahsiAuthorize)
    const response = await fetch(ENDPOINTS.authCuahsiAuthorize)
    const json = await response.json()
    console.log(json)

    window.open(
        json.authorization_url,
      "_blank",
      "location=1, status=1, scrollbars=1, width=800, height=800"
    );
    // callback?.();
  }