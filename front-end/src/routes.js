import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const CandidateSignUpPage = lazy(() => import('./pages/CandidateSignUpPage'));
const FacultySignUpPage = lazy(() => import('./pages/FacultySignUpPage'));
// const Learning = lazy(() => import('./components/Learning'));

function Routes() {
    return (
        <BrowserRouter >
            <Suspense fallback={
                <>
                    <div id='loadingScreen'>
                        Loading
                        <div id='loadingIcon'>
                            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                </>
            }>
                <Switch>
                    <Route exact path="/" element={<LoginPage />} />
                    <Route exact path="/CandidateSignUp" element={<CandidateSignUpPage />} />
                    <Route exact path="/FacultySignUp" element={<FacultySignUpPage />} />
                    {/* <Route exact path="/learn" element={<Learning />} /> */}

                    <Route path="*" element={<center><h1>Page Not Found</h1></center>} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}

export default Routes;