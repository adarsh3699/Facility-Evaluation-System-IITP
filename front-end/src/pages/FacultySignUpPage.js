import React, { useState, useEffect } from 'react';
import Loader from "../components/Loader";

import "../css/loginPage.css";

function FacultySignUpPage() {
    return (
        <div>
            <div id="wrapper">
                <div id='LoginUserTitle'>Sign Up for Candidate</div>
                <form id="form" >
                    <div>
                        <input type="text" required placeholder="Email" id="email" />
                    </div>

                    <div>
                        <input type="password" required placeholder="Password" id="password" />
                    </div>

                    <div>
                        <input type="password" required placeholder="Confirm Password" id="password" />
                    </div>

                    <div>
                        <button id="SignUpBtn">Sign Up</button>
                    </div>
                    {/* <Loader isLoading={true} /> */}
                    <div id="msg" > msg</div>
                </form>
            </div>
        </div>
    )
}

export default FacultySignUpPage;