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
                        <input type="text" placeholder="Email" id="email" />
                    </div>

                    <div>
                        <input type="password" placeholder="Password" id="password" />
                    </div>

                    <div>
                        <button id="login">Login</button>
                    </div>
                </form>
                    <div id="msg" className="red" > msg </div>
                    {/* <Loader isLoading={true} /> */}

                    <div>
                        <a href="/register">Forgot Password</a>
                    </div>

                    <hr />

                    <div>
                        <a href="/register">Sign Up for Faculty</a>
                    </div>

                    <div>
                        <a href="/register">Sign Up for Candidate</a>
                    </div>
                
            </div>
        </div>
    );
}

export default LoginPage;
