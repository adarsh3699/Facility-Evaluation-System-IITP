import React, { useState, useEffect } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

function ForgetPasswordPage() {

    const [msg, setMsg] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);

    async function handleFacultyLoginForm(e) {
        e.preventDefault();
        setApiLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email && password) {
            const apiResp = await apiCall("login/faculty?email=" + email + "&password=" + password);
            if (apiResp.statusCode === 200) {
                setApiLoading(false)
                setMsg(apiResp.msg)
                // document.location.href = "/";
            } else {
                setApiLoading(false)
                setMsg(apiResp.msg)
            }
        }
    }

    return (
        <div>
            <div id="wrapper">
                <form className="form" onSubmit={handleFacultyLoginForm}>
                    <div>
                        <input type="email" name='email' required placeholder="Email" className="email" />
                    </div>

                    <div>
                        <input type="password" name='password' required pattern="().{8,}" placeholder="Password (Min 8 digit)" className="password" />
                    </div>

                    <div>
                        <input type="password" name='confPassword' required pattern="().{8,}" placeholder="Confirm Password (Min 8 digit)" className="password" />
                    </div>
                </form>
                <div className="msg" >{msg}</div>
                {/* <Loader isLoading={true} /> */}

                <div id='forgotFacultyPass'>
                    <a href="/FacultySignUpPage">Forgotten Password</a>
                </div>

                <hr />

                <div id='SignUpBtnArea'>
                    <a href="/FacultySignUp" id='facultySignUpBtn'>Sign Up for Faculty</a>
                    <a href="/CandidateSignUp" id='candidateSignUpLoginBtn'>Sign Up/Login for Candidate</a>
                </div>
            </div>
        </div>
    );
}

export default ForgetPasswordPage;
