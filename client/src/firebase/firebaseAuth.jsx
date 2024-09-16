import React from "react";
import { GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

import { auth } from "./firebase";

export const FirebaseAuth = () => {
  React.useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    };

    ui.start("#firebaseui-auth-container", uiConfig);

    return () => {
      ui.delete();
    };
  }, []);

  return <div id='firebaseui-auth-container'></div>;
};
