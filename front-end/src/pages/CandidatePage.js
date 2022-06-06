import React, { useState, useEffect } from 'react';
import { getCookie, userTypeCandid, apiCall } from "../utils";

import "../css/candidatePage.css"

function CandidatePage() {

    const [name, setName] = useState("");
    const [applicationNumber, setApplicationNumber] = useState("");
    const [email, setEmail] = useState("");
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
                const apiResp = await apiCall("candidate?userId=" + getCookie("userId"));
                if (apiResp.statusCode === 200) {

                    setName(apiResp?.data[0]?.name)
                    setApplicationNumber(apiResp?.data[0]?.applicationNumber)
                    setEmail(apiResp?.data[0]?.email)
                    setDepartment(apiResp?.data[0]?.department)
                    setDesignation(apiResp?.data[0]?.designation)
                    setTitleOfTheTalk(apiResp?.data[0]?.titleOfTheTalk)
                    setResearchTopic(apiResp?.data[0]?.researchTopic)
                    setkeyword1(apiResp?.data[0]?.Keyword1)
                    setkeyword2(apiResp?.data[0]?.Keyword2)
                    setkeyword3(apiResp?.data[0]?.Keyword3)
                    setkeyword4(apiResp?.data[0]?.Keyword4)
                } else {

                }
            })();
        }
    }, []);

    function handleNameValue(e) {
        setName(e.target.value)
    }

    function handleApplicationNumberValue(e) {
        setApplicationNumber(e.target.value)
    }

    function handleEmailValue(e) {
        setEmail(e.target.value)
    }

    function handleDepartmentValue(e) {
        setDepartment(e.target.value)
    }

    function handleDesignationValue(e) {
        setDesignation(e.target.value)
    }

    function handleTitleOfTheTalkValue(e) {
        setTitleOfTheTalk(e.target.value)
    }

    function handleResearchTopicValue(e) {
        setResearchTopic(e.target.value)
    }

    function handleKeyword1Value(e) {
        setkeyword1(e.target.value)
    }

    function handleKeyword2Value(e) {
        setkeyword2(e.target.value)
    }

    function handleKeyword3Value(e) {
        setkeyword3(e.target.value)
    }

    function handleKeyword4Value(e) {
        setkeyword4(e.target.value)
    }


    return (
        <div>
            <div id='title'>Candidate Page</div>
            <form id='CandidatePageForm'>
                <div className='lableInputBox'>
                    <label>Name of the Applicant</label>
                    <input type='text' value={name} onChange={handleNameValue} />
                </div>

                <div className='lableInputBox'>
                    <label>Application Number</label>
                    <input type='number' value={applicationNumber} onChange={handleApplicationNumberValue} />
                </div>
                <div className='lableInputBox'>
                    <label>Email</label>
                    <input type='email' value={email} onChange={handleEmailValue} />
                </div>
                <div className='lableInputBox'>
                    <label>Department Applied for</label>
                    <select value={department} onChange={handleDepartmentValue}>
                        <option>A</option>
                        <option>B</option>
                        <option>C</option>
                    </select>
                </div>
                <div className='lableInputBox'>
                    <label>Designation Applied for</label>
                    <select value={designation} onChange={handleDesignationValue}>
                        <option>Assistant</option>
                        <option>Professor</option>
                        <option>Asso</option>
                    </select>
                </div>
                <div className='lableInputBox'>
                    <label>Title of the Talk</label>
                    <textarea value={titleOfTheTalk} onChange={handleTitleOfTheTalkValue}></textarea>
                </div>
                <div className='lableInputBox'>
                    <label>Broad Area of Research Topic</label>
                    <input type='text' value={researchTopic} onChange={handleResearchTopicValue} />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 1 of research area</label>
                    <input type='text' value={keyword1} onChange={handleKeyword1Value} />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 2 of research area</label>
                    <input type='text' value={keyword2} onChange={handleKeyword2Value} />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 3 of research area</label>
                    <input type='text' value={keyword3} onChange={handleKeyword3Value} />
                </div>
                <div className='lableInputBox'>
                    <label>Keyword 4 of research area</label>
                    <input type='text' value={keyword4} onChange={handleKeyword4Value} />
                </div>
                <button id='submitBtn'>Submit</button>
            </form>
        </div>
    );
}

export default CandidatePage;
