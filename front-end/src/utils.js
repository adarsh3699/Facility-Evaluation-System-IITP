import Cookies from 'universal-cookie';
const cookies = new Cookies();

// const apiBaseUrl = "https://bhemu-notes.herokuapp.com/api/"
const apiBaseUrl = "http://localhost:4000/";
const userTypeFaculty = "c4ca4238a0b923820dcc509a6f75849b";
const userTypeCandid = "c81e728d9d4c2f636f067f89cc14862c";

// variables for setting cookie expiratiom tym
const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

async function apiCall(endpoint, method, body) {
    const apiUrl =  apiBaseUrl + endpoint;
    try {
        let apiCallResp;
        if (method === "GET" || method === undefined) {
            apiCallResp = await fetch(apiUrl);
        } else {
            apiCallResp = await fetch(apiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        }
       
        const apiJsonResp = await apiCallResp.json();
        return apiJsonResp;
    } catch (error) {
        return { msg: "Something went wrong", statusCode: 500 };
    }
}

function getCookie(name) {
    try {
        const cookiesValue = cookies.get(name);
        if (cookiesValue) {
            return cookiesValue;
        }
    } catch {}

    return null;
}

function createCookie(name, value) {
    try {
        cookies.set(name, value, { path: "/", expires: COOKIE_EXPIRATION_TIME });
    } catch {}
}

function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
}

export { apiCall, getCookie, createCookie, validateUsername, userTypeFaculty, userTypeCandid };