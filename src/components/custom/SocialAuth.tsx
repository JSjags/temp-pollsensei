// const Client_Id = process.env.VITE_NEXT_GOOGLE_REG_CLIENT_ID;



import React from "react";
import { SocialButton } from "reactjs-social-login";
import { GoogleLoginButton, FacebookLoginButton } from "reactjs-social-login";

export default function SocialAuth() {
  // Handle successful login
  const handleSocialLoginSuccess = (user:any) => {
    console.log("User data:", user);
    // Here, you would send the token or user info to your backend for further processing
  };

  // Handle failed login
  const handleSocialLoginFailure = (err:any) => {
    console.error("Login failed:", err);
  };

const Client_Id = process.env.VITE_NEXT_GOOGLE_REG_CLIENT_ID;



  return (
    <div> 
      <SocialButton
        provider="google"
        appId={Client_Id}
        onLoginSuccess={handleSocialLoginSuccess}
        onLoginFailure={handleSocialLoginFailure}
      >
        <GoogleLoginButton />
      </SocialButton>

      <SocialButton
        provider="facebook"
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        onLoginSuccess={handleSocialLoginSuccess}
        onLoginFailure={handleSocialLoginFailure}
      >
        <FacebookLoginButton />
      </SocialButton>
    </div>
  );
}
