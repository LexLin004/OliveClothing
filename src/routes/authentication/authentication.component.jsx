// import { useEffect } from 'react';
// import { getRedirectResult } from 'firebase/auth';

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";

import './authentication.styles.scss'

const Authentication = () => {
  /** 
  useEffect(
    () => async () => {
      const response = getRedirectResult(auth); // 当redirect back from google auth, this will run, and get auth
      console.log(response);
      if (response) {
        const userDocRef = await createUserDocumentFromAuth(response.user);
      }
    }, [])
  */

    // 相关的 logGoogleUser 代码已经移动至sign-in-form.component.jsx


  // const logGoogleRedirectUser = async () => { 
  //   const { user } = await signInWithGoogleRedirect();
  //   // 因为redirect会将网页直接导航至googleAuth, 使得浏览器丢失当前所有状态(unmount)，所以后续代码将得不到执行，并且整个网页将re-initialize(remount)
  //   // 所以需要使用useEffect from react (run once on mounting))和 getRedirectResult from firebase/auth 和 auth from firebase.utils (that is what the get redirect result is going to get.)来解决问题
  //   console.log(user);
  // };

  return (
    <div className="authentication-container">
      <SignInForm />
      {/* <button onClick={signInWithGoogleRedirect}>Sign in with Google Redirect</button> */}
      <SignUpForm />
    </div>
  );
};

export default Authentication;
