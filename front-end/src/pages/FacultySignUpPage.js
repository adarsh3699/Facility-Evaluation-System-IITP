import React, { useState, useEffect } from 'react';
import { apiCall } from "../utils";
import Loader from "../components/Loader";

import "../css/loginPage.css";

function FacultySignUpPage() {

    const [msg, setMsg] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);

    async function handleFacultySignUpForm(e) {
        e.preventDefault();
        setApiLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;
        
        if(password == confPassword) {
            const apiResp = await apiCall("SignUp/candidate?email=" + email + "&password=" + password);
            if (apiResp.statusCode === 200) {
                setApiLoading(false)
                setMsg(apiResp.msg)
                e.target.reset()
            } else {
                setApiLoading(false)
                setMsg(apiResp.msg)
            }
        }
    }

    return (
        <div>
            <div id="wrapper">
                <div id='LoginUserTitle'>Sign Up for Candidate</div>
                <form className="form" onSubmit={ handleFacultySignUpForm } >
                    <div>
                        <input type="email" name='email' required placeholder="Email" className="email" />
                    </div>

                    <div>
                        <input type="password" name='password' required pattern="().{8,}" placeholder="Password (Min 8 digit)" className="password" />
                    </div>

                    <div>
                        <input type="password" name='confPassword' required pattern="().{8,}" placeholder="Confirm Password (Min 8 digit)" className="password" />
                    </div>

                    <div>
                        <button id="SignUpBtn" className={isApiLoading ? "SignUpBtnIsloading": "" }>Sign Up</button>
                    </div>
                    <Loader isLoading={ isApiLoading } />
                    <div className="msg" >{msg}</div>
                </form>
            </div>
        </div>
    )
}

export default FacultySignUpPage;