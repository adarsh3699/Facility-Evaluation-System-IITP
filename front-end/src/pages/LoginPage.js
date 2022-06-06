import React, { useState, useEffect } from 'react';
import { apiCall, getCookie, createCookie, userTypeFaculty, userTypeCandid } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

function LoginPage() {

    const [msg, setMsg] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);

    useEffect(() => {
        if (getCookie("userId") && getCookie("userType")) {
            if (getCookie("userType") === userTypeFaculty) {
                document.location.href = "/faculty-page";
            } else if (getCookie("userType") === userTypeCandid) {
                document.location.href = "/candidate-page";
            }
            return;
        }
    }, []);

    async function handleLoginClick(e) {
        e.preventDefault();
        setApiLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const userType = e.target.userType.value;

        if (email && password && userType) {
            const apiResp = await apiCall("auth/login", "POST", {
                email, password, userType
            });
            if (apiResp.statusCode === 200) {
                setMsg(apiResp.msg)
                const userId = apiResp?.data?.id;
                const userTypeEncr = (apiResp?.data?.userType).trim();
                if (userId && userTypeEncr) {
                    createCookie("userId", userId);
                    createCookie("userType", userTypeEncr);
                    console.log(userTypeEncr === userTypeCandid)
                    if (userTypeEncr === userTypeFaculty) {
                        document.location.href = "/faculty-page";
                    } else if (userTypeEncr === userTypeCandid) {
                        document.location.href = "/candidate-page";
                    }
                } else {
                    setMsg("Something went wrong")
                }
            } else {
                setMsg(apiResp.msg)
            }
        } else {
            setMsg("Please fill all details")
        }
        setApiLoading(false)
    }

    return (
        <div>
            <div id="wrapper">
                <div id='Title'>Login</div>
                <form className="form" onSubmit={handleLoginClick}>
                    <input type="email" name='email' required placeholder="Email" className="email" />
                    <br /><br />

                    <input type="password" name='password' required placeholder="Password" className="password" />
                    <br /><br />

                    <select id='userType' name="userType">
                        <option value="1">Faculty</option>
                        <option value="2">Candidate</option>
                    </select>
                    <br /><br />

                    <button id="loginBtn" className={isApiLoading ? "loginBtnIsloading" : ""}>Login</button>
                </form>
                <div className="msg" style={{ marginBottom: "30px" }} >{msg}</div>
                <Loader isLoading={isApiLoading} />

                <a href="/forget-password" id='forgotPass'>Forgotten Password</a>

                <div id='SignUpBtnArea'>
                    <a href="/signup" id='SignUpPageBtn'>Sign Up</a>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
