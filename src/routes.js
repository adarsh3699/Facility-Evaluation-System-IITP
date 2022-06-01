import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';

// import HomePage from './pages/HomePage';
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage"
// import Learning from "./components/Learning";

const LoginPage = lazy(() => import('./pages/LoginPage'));
// const AboutPage = lazy(() => import('./pages/AboutPage'));
// const ContactPage = lazy(() => import('./pages/ContactPage'));
// const Learning = lazy(() => import('./components/Learning'));

function Routes() {
    return (
        <BrowserRouter >
            <Suspense fallback={
                <>
                    <div id='loadingScreen'>
                        loading
                        <div id='loadingIcon'>
                            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                </>
            }>
                <Switch>
                    <Route exact path="/" element={<LoginPage />} />
                    {/* <Route exact path="/about" element={<AboutPage />} />
                    <Route exact path="/contact" element={<ContactPage />} />
                    <Route exact path="/learn" element={<Learning />} /> */}

                    <Route path="*" element={<center><h1>Page Not Found</h1></center>} />
                </Switch>
            </Suspense>
        </BrowserRouter>
    );
}

export default Routes;