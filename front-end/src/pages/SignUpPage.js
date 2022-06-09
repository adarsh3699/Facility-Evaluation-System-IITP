import React, { useState } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

function SignUpPage() {
    const [msg, setMsg] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);

    async function handleSignUpClick(e) {
        e.preventDefault();
        setApiLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;
        const userType = e.target.userType.value;

        if (password === confPassword) {
            const apiResp = await apiCall("auth/register", "POST", {
                email, password, userType
            });
            if (apiResp.statusCode === 200) {
                setMsg(apiResp.msg + "\n Please check your email for account verification");
            } else {
                setMsg(apiResp.msg)
            }
        } else {
            setMsg("password does not match")
        }
        setApiLoading(false);
    }

    return (
        <div>
            <div id="wrapper">
                <div id='Title'>Sign Up</div>
                <form className="form" onSubmit={handleSignUpClick} >
                    <input type="email" name='email' required placeholder="Email" className="email" />
                    <br /><br />
                    <input type="password" name='password' required pattern="().{8,}" placeholder="Password (Min 8 digit)" className="password" />
                    <br /><br />
                    <input type="password" name='confPassword' required pattern="().{8,}" placeholder="Confirm Password (Min 8 digit)" className="password" />
                    <br /><br />
                    <select id='userType' name="userType">
                        <option value="1">Faculty</option>
                        <option value="2">Candidate</option>
                    </select>
                    <br /><br />

                    <button id="SignUpBtn" className={isApiLoading ? "SignUpBtnIsloading" : ""}>Sign Up</button>
                    <br /><br />

                    <div className="msg" >{msg}</div>
                    <Loader isLoading={isApiLoading} />
                </form>
                <a href="/" id='forgotPass'>Back to Login Page</a>
            </div>
        </div>
    )
}

export default SignUpPage;