import React, { useState, useEffect } from 'react';
import Loader from "../components/Loader";
import { apiCall } from "../utils";

import "../css/loginPage.css";

function CandidateSignUpPage() {
    const [loginMsg, setLoginMsg] = useState("");
    const [signUpMsg, setSignUpMsg] = useState("");
    const [isSignUpApiLoading, setIsSignUpApiLoading] = useState(false);

    async function handleCandidateSignUpForm(e) {
        e.preventDefault();
        setIsSignUpApiLoading(true);
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confPassword = e.target.confPassword.value;
        
        if(password == confPassword) {
            const apiResp = await apiCall("SignUp/candidate?email=" + email + "&password=" + password);
            if (apiResp.statusCode === 200) {
                setIsSignUpApiLoading(false)
                setSignUpMsg(apiResp.msg)
                e.target.reset()
            } else {
                setIsSignUpApiLoading(false)
                setSignUpMsg(apiResp.msg)
            }
        }
    }

    return (
        <div>
            <div id="wrapper" className='CandidateSignUpWrapper'>
                <div id='LoginUserTitle'>Candidate Login</div>

                <form className="form" >
                    <div>
                        <input type="email" name='email' required placeholder="Email" className="email" />
                    </div>

                    <div>
                        <input type="password" name='password' required placeholder="Password" className="password" />
                    </div>

                    <div>
                        <button id="loginBtn">Login</button>
                    </div>
                </form>

                <div className="msg" > {loginMsg} </div>
                {/* <Loader isLoading={true} /> */}

                <div id='forgotFacultyPass'>
                    <a href="/register">Forgotten Password</a>
                </div>
                <div id='SignUpUserTitle'>Sign Up for Candidate</div>
                <form className="form" onSubmit={ handleCandidateSignUpForm }>
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
                        <button id="SignUpBtn" className={isSignUpApiLoading? "SignUpBtnIsloading": ""}>Sign Up</button>
                    </div>
                    <Loader isLoading={isSignUpApiLoading} />
                    <div className="msg" > { signUpMsg }</div>
                </form>
            </div>
        </div>
    )
}

export default CandidateSignUpPage;