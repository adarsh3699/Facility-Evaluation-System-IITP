import React, { useState, useEffect } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

function ForgetPasswordPage() {

    const [emailVal, setEmailValsg] = useState("");
    const [encryptedOtp, setEncryptedOtp] = useState("");

    const [otpMsg, setOtpMsg] = useState("");
    const [passMsg, setPassMsg] = useState("");

    const [isOTPApiLoading, setIsOTPApiLoading] = useState(false);
    const [isPassApiLoading, setIsPassApiLoading] = useState(false);
    const [showChangePassForm, setShowChangePassForm] = useState(false);

    function handleEmailValue(e) {
        setEmailValsg(e.target.value);
    }

    async function handleSendOtpBtnClick(e) {
        e.preventDefault();

        if (emailVal) {
            setIsOTPApiLoading(true);
            const apiResp = await apiCall("auth/forget-password", "POST", { email: emailVal });
            if (apiResp.statusCode === 200) {
                setShowChangePassForm(true)
                setOtpMsg(apiResp.msg);
                setEncryptedOtp(apiResp.otp)
                console.log(apiResp.otp);
            } else {
                setOtpMsg(apiResp.msg)
            }
            setIsOTPApiLoading(false)
        } else {
            setOtpMsg("Please Enter Your Email")
        }
    }

    async function handleConfirmPasswordClick(e) {
        e.preventDefault();

        setIsPassApiLoading(true);
        const otp = e.target.otp.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;

        if (password && confPassword) {
            const apiResp = await apiCall("auth/change-password", "POST", { email: emailVal, password, encryptedOtp, otp });
            if (apiResp.statusCode === 200) {
                setPassMsg(apiResp.msg)
                // document.location.href = "/";
            } else {
                setPassMsg(apiResp.msg)
            }
            setIsPassApiLoading(false)
        } else { }
    }

    return (
        <div>
            <div id="wrapper">
                <div id='Title'>Forget Password</div>
                <form onSubmit={handleSendOtpBtnClick} style={showChangePassForm ? { display: "none" } : { display: "block" }} >
                    <input type="email" className="email" onChange={handleEmailValue} value={emailVal} placeholder="Email" />
                    <br />
                    <button id='sendOtpBtn'>Send OTP</button>
                    <br /><br />
                    <div className="msg" >{otpMsg}</div>
                    <Loader isLoading={isOTPApiLoading} />
                    <br />
                </form>

                <form className="form" style={showChangePassForm ? { display: "block" } : { display: "none" }} onSubmit={handleConfirmPasswordClick}>
                    <input type="number" name='otp' required placeholder="Enter OTP" className="email" />
                    <br /><br />
                    <input type="password" name='password' required pattern="().{8,}" placeholder="New Password (Min 8 digit)" className="password" />
                    <br /><br />
                    <input type="password" name='confPassword' required pattern="().{8,}" placeholder="Confirm Password (Min 8 digit)" className="password" />
                    <br /> <br />
                    <button id="loginBtn" className={isPassApiLoading ? "loginBtnIsloading" : ""}>Confirm Password</button>
                    <div className="msg" >{passMsg}</div>
                    <Loader isLoading={isPassApiLoading} />
                </form>

                <a href="/" id='forgotPass'>Back to Login Page</a>

            </div>
        </div>
    );
}

export default ForgetPasswordPage;
