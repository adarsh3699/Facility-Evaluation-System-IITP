import Cookies from 'universal-cookie';
const cookies = new Cookies();

const expiryDate = "2022-09-28T22:59:02.448804522Z";

const CONTACT_EMAIL = ""

const QUESTIONS = [
    {ques: "Knowledge"},
    {ques: "concepts"},
    {ques: "Research Aptitude"},
    {ques: "Innovation"},
    {ques: "patents"},
    {ques: "Technology transferred"},
    {ques: "vision"},
    {ques: "Time management"},
    {ques: "Presentation"},
    {ques: "communication skill"},
    {ques: "personality"},
    {ques: "response to questions"}
];

const DEPARTMENT = ["CE", "CH", "CS", "EE", "HS", "MA", "MC", "ME", "MM", "PH"]
const QUESTION_OPTIONS = [1,2,3,4,5,6,7,8,9,10];

const CANDIDATE_INFO = [
    { title: "Name", key: "name" },
    { title: "ApplicationNumber", key: "applicationNumber" },
    { title: "Email", key: "email" },
    { title: "Phone No.", key: "phoneNo" },
    { title: "WhatsApp No.", key: "whatsappNo" },
    { title: "Department", key: "department" },
    { title: "Designation", key: "designation" },
    { title: "Broad Area of Research Topic", key: "researchTopic"},
    { title: "Keyword1", key: "Keyword1" },
    { title: "Keyword2", key: "Keyword2" },
    { title: "Keyword3", key: "Keyword3" },
    { title: "Keyword4", key: "Keyword4" },
]

const API_BASE_URL = "http://localhost:4000/";

const userTypeFaculty = "c4ca4238a0b923820dcc509a6f75849b";
const userTypeCandid = "c81e728d9d4c2f636f067f89cc14862c";
const userTypeAdmin = "eccbc87e4b5ce2fe28308fd9f2a7baf3";

// variables for setting cookie expiratiom tym
const COOKIE_EXPIRATION_MINS = 30 * 24 * 60; // 30 days

let COOKIE_EXPIRATION_TYM = new Date();
COOKIE_EXPIRATION_TYM.setTime(COOKIE_EXPIRATION_TYM.getTime() + (COOKIE_EXPIRATION_MINS * 60 * 1000));
const COOKIE_EXPIRATION_TIME = COOKIE_EXPIRATION_TYM;

async function apiCall(endpoint, method, body) {
    const apiUrl = API_BASE_URL + endpoint;
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
    } catch { }

    return null;
}

function createCookie(name, value) {
    try {
        cookies.set(name, value, { path: "/", expires: COOKIE_EXPIRATION_TIME });
    } catch { }
}

function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
}

export {
    apiCall, getCookie, createCookie, validateUsername,
    userTypeFaculty, userTypeCandid, userTypeAdmin, expiryDate,
    CONTACT_EMAIL, QUESTIONS, QUESTION_OPTIONS, CANDIDATE_INFO, DEPARTMENT, API_BASE_URL
};