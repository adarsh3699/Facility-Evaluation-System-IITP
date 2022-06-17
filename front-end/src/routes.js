import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'));
const FacultyPage = lazy(() => import('./pages/FacultyPage'));
const CandidatePage = lazy(() => import('./pages/CandidatePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

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
                    <Route exact path="/signup" element={<SignUpPage />} />
                    <Route exact path="/forget-password" element={<ForgetPasswordPage />} />
                    <Route exact path="/faculty-page" element={<FacultyPage />} />
                    <Route exact path="/candidate-page" element={<CandidatePage />} />
                    <Route exact path="/admin-page" element={<AdminPage />} />

                    <Route path="*" element={<center><h1>Page Not Found</h1></center>} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}

export default Routes;