import React, { useState, useEffect } from 'react';
import Loader from "../components/Loader";

import "../css/loginPage.css";

function LoginPage() {
    return (
        <div>
            <div id="wrapper">
                <form id="form" >
                    <div>
                        <div id='LoginUserTitle'>Faculty Login</div>
                        <input type="text" required placeholder="Email" id="email" />
                    </div>

                    <div>
                        <input type="password" required placeholder="Password" id="password" />
                    </div>

                    <div>
                        <button id="loginBtn">Login</button>
                    </div>
                </form>
                    <div id="msg" > msg </div>
                    {/* <Loader isLoading={true} /> */}

                    <div id='forgotFacultyPass'>
                        <a href="/register">Forgotten Password</a>
                    </div>

                    <hr />
                    
                    <div id='SignUpBtnArea'>
                        <a href="/FacultySignUp" id='facultySignUpBtn'>Sign Up for Faculty</a>
                        <a href="/CandidateSignUp" id='candidateSignUpBtn'>Sign Up/Login for Candidate</a>
                    </div>
            </div>
        </div>
    );
}

export default LoginPage;
