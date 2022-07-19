import React, { useState, useEffect } from 'react';
import {
    getCookie, createCookie, userTypeCandid, apiCall,
    expiryDate, DEPARTMENT
} from "../utils";
import Loader from "../components/Loader";

import "../css/candidatePage.css"

const userId = getCookie("userId")

function CandidatePage() {
    const [isDateExpire, setIsDateExpire] = useState(false);
    const [isSubmitApiLoading, setIsSubmitApiLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const [name, setName] = useState("");
    const [applicationNumber, setApplicationNumber] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [whatsappNo, setWhatsappNo] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [titleOfTheTalk, setTitleOfTheTalk] = useState("");
    const [researchTopic, setResearchTopic] = useState("");
    const [keyword1, setkeyword1] = useState("");
    const [keyword2, setkeyword2] = useState("");
    const [keyword3, setkeyword3] = useState("");
    const [keyword4, setkeyword4] = useState("");

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeCandid) {
            document.location.href = "/";
            return;
        } else {
            (async function getData() {
                const apiResp = await apiCall("candidate", "POST", { userId });
                if (apiResp.statusCode === 200) {

                    setName(apiResp?.data[0]?.name)
                    setApplicationNumber(apiResp?.data[0]?.applicationNumber || "")
                    setEmail(apiResp?.data[0]?.email)
                    setPhoneNo(apiResp?.data[0]?.phoneNo || "")
                    setWhatsappNo(apiResp?.data[0]?.whatsappNo || "")
                    setDepartment(apiResp?.data[0]?.department)
                    setDesignation(apiResp?.data[0]?.designation)
                    setTitleOfTheTalk(apiResp?.data[0]?.titleOfTheTalk)
                    setResearchTopic(apiResp?.data[0]?.researchTopic)
                    setkeyword1(apiResp?.data[0]?.Keyword1)
                    setkeyword2(apiResp?.data[0]?.Keyword2)
                    setkeyword3(apiResp?.data[0]?.Keyword3)
                    setkeyword4(apiResp?.data[0]?.Keyword4)
                    // const addedOn = apiResp?.data[0]?.addedOn;

                    // console.log("expiryDate", new Date(expiryDate).getTime());
                    // console.log("addedOn", new Date(addedOn).getTime());
                    // console.log("Date", Date.now());

                    if (Date.now() > new Date(expiryDate).getTime()) {
                        setIsDateExpire(true);
                        setMsg("The deadline for submission has expired.")
                    }
                } else {
                    setMsg(apiResp.msg)
                }
            })();
        }
    }, []);

    function handleNameValue(e) {
        setName(e.target.value);
    }

    function handleApplicationNumberValue(e) {
        setApplicationNumber(e.target.value);
    }

    function handlePhoneNoValue(e) {
        setPhoneNo(e.target.value);
    }

    function handleWhatsappNoValue(e) {
        setWhatsappNo(e.target.value);
    }

    function handleDepartmentValue(e) {
        setDepartment(e.target.value);
    }

    function handleDesignationValue(e) {
        setDesignation(e.target.value);
    }

    function handleTitleOfTheTalkValue(e) {
        setTitleOfTheTalk(e.target.value);
    }

    function handleResearchTopicValue(e) {
        setResearchTopic(e.target.value);
    }

    function handleKeyword1Value(e) {
        setkeyword1(e.target.value);
    }

    function handleKeyword2Value(e) {
        setkeyword2(e.target.value);
    }

    function handleKeyword3Value(e) {
        setkeyword3(e.target.value);
    }

    function handleKeyword4Value(e) {
        setkeyword4(e.target.value);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setIsSubmitApiLoading(true);
        const apiResp = await apiCall("candidate/post", "POST", { userId, name, phoneNo, whatsappNo, applicationNumber, department, designation, titleOfTheTalk, researchTopic, keyword1, keyword2, keyword3, keyword4 });
        if (apiResp.statusCode === 200) {
            setMsg(apiResp.msg)
        } else {
            setMsg(apiResp.msg)
        }
        setIsSubmitApiLoading(false);
    }

    function handleLogoutBtnClick() {
        createCookie("userId", "");
        createCookie("userType", "");
        document.location.href = "/";
    }

    return (
        <div>
            <div id='title'>Candidate Page</div>
            <form id='CandidatePageForm' onSubmit={handleFormSubmit}>
                <div className='lableInputBox'>
                    <label>Name of the Applicant *</label>
                    <input type='text' value={name} readOnly={isDateExpire} onChange={handleNameValue} placeholder="Full Name" required />
                </div>

                <div className='lableInputBox'>
                    <label>Application Number *</label>
                    <input type='number' value={applicationNumber} readOnly={isDateExpire} onChange={handleApplicationNumberValue} placeholder="Application Number" required />
                </div>

                <div className='lableInputBox'>
                    <label>Email</label>
                    <input type='email' value={email} onChange={() => { }} readOnly={true} />
                </div>

                <div className='lableInputBox'>
                    <label>Phone Number *</label>
                    <input type='tel' value={phoneNo} onChange={handlePhoneNoValue} readOnly={isDateExpire} placeholder="Phone No. (with country code)" required />
                </div>

                <div className='lableInputBox'>
                    <label>WhatsApp Number *</label>
                    <input type='tel' value={whatsappNo} onChange={handleWhatsappNoValue} readOnly={isDateExpire} placeholder="WhatsApp No. (with country code)" required />
                </div>

                <div className='lableInputBox'>
                    <label>Department Applied For *</label>
                    <select value={department} disabled={isDateExpire} onChange={handleDepartmentValue} required>
                        {
                            DEPARTMENT.map((item, index) => (
                                <option key={index}>{item}</option>
                            ))
                        }
                    </select>
                </div>

                <div className='lableInputBox'>
                    <label>Designation Applied For *</label>
                    <select value={designation} disabled={isDateExpire} onChange={handleDesignationValue} required>
                        <option>Assistant</option>
                        <option>Professor</option>
                        <option>Associate</option>
                    </select>
                </div>
                <div className='lableInputBox'>
                    <label>Title of the Talk *</label>
                    <input type='text' value={titleOfTheTalk} readOnly={isDateExpire} onChange={handleTitleOfTheTalkValue} placeholder="Title of the Talk" required />
                </div>
                <div className='lableInputBox'>
                    <label>Broad Area of Research Topic *</label>
                    <input type='text' value={researchTopic} readOnly={isDateExpire} onChange={handleResearchTopicValue} placeholder="Broad Area of Research Topic" required />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 1 of research area</label>
                    <input type='text' value={keyword1} readOnly={isDateExpire} onChange={handleKeyword1Value} placeholder="Keyword 1" />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 2 of research area</label>
                    <input type='text' value={keyword2} readOnly={isDateExpire} onChange={handleKeyword2Value} placeholder="Keyword 2" />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 3 of research area</label>
                    <input type='text' value={keyword3} readOnly={isDateExpire} onChange={handleKeyword3Value} placeholder="Keyword 3" />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 4 of research area</label>
                    <input type='text' value={keyword4} readOnly={isDateExpire} onChange={handleKeyword4Value} placeholder="Keyword 4" />
                </div>
                <button id='submitBtn' className={isDateExpire ? "submitBtnLoading" : ""} >Submit</button>

                <div id="msg" >{msg}</div>
                <Loader isLoading={isSubmitApiLoading} id='loader' />
            </form>
            <div id='logOut'><span onClick={handleLogoutBtnClick}>Log Out</span></div>
        </div>
    );
}

export default CandidatePage;
