import React, { useState, useEffect } from 'react';
import { getCookie, userTypeFaculty, apiCall, contactEmail, questions } from "../utils";
import Modal from "../components/Modal";
import Table from "../components/Table"
import Loader from "../components/Loader"

import "../css/facultyPage.css"

const userId = getCookie("userId")

function FacultyPage() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [isGetApiLoading, setIsGetApiLoading] = useState(false);
    const [isApiLoading, setIsApiLoading] = useState(false);


    const [facultyDetails, setFacultyDetails] = useState({});
    const [candidateDetails, setCandidateDetails] = useState({});
    const [notMarksGivenCandidates, setNotMarksGivenCandidates] = useState([]);
    const [marksGivenCandidates, setMarksGivenCandidates] = useState([]);

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeFaculty) {
            document.location.href = "/";
            return;
        } else {
            setIsGetApiLoading(true);
            (async function getData() {
                const apiResp = await apiCall("faculty", "post", { userId });
                if (apiResp.statusCode === 200) {
                    const { facDetails = {}, candDetails = [] } = apiResp?.data || {};
                    setFacultyDetails(facDetails);

                    setMarksGivenCandidates(candDetails.filter((item) => {
                        return item.questionMarksId ? true : false;
                    }));
                    setNotMarksGivenCandidates(candDetails.filter((item) => {
                        return item.questionMarksId ? false : true;
                    }));
                    // setNotMarksGivenCandidates(candDetails.filter((item) => (item.questionMarksId ? false : true)));
                } else {
                    setError(apiResp.msg);
                }
                setIsGetApiLoading(false);
            })();
        }
    }, []);

    async function handleConfirmBtn() {
        const apiResp = await apiCall("faculty/confirm", "post", { userId });
        if (apiResp.statusCode === 200) {
            setFacultyDetails({
                ...facultyDetails,
                isVerified: 1,
            });
        } else {
            setError(apiResp.msg)
        }
    }

    async function cellClick(email) {
        setIsModalOpen(true);
        setCandidateDetails([])

        const apiResp = await apiCall("candidate/by-email", "post", { email });
        if (apiResp.statusCode === 200) {
            setCandidateDetails(apiResp.data[0])
        } else {
            setError(apiResp.msg)
        }
    }

    function handleModalClose() {
        setIsModalOpen(false);
    }

    async function handleQuesMarksSubmit(e) {
        e.preventDefault()
        const ques1 = e.target.ques1.value;
        const ques2 = e.target.ques2.value;
        const ques3 = e.target.ques3.value;
        const ques4 = e.target.ques4.value;
        const ques5 = e.target.ques5.value;
        const ques6 = e.target.ques6.value;
        const ques7 = e.target.ques7.value;
        const ques8 = e.target.ques8.value;
        const ques9 = e.target.ques9.value;
        const ques10 = e.target.ques10.value;
        const ques11 = e.target.ques11.value;
        const ques12 = e.target.ques12.value;
        const suitable = e.target.suitable.value;

        if (ques1 && ques2 && ques3 && ques4 && ques5 && ques6 && ques7 && ques8 && ques9 && ques10 && ques11 && ques12 && suitable) {
            setIsApiLoading(true)
            const apiResp = await apiCall("faculty/submit-marks", "post", {
                candEmail: candidateDetails.email, facEmail: facultyDetails.email,
                ques1, ques2, ques3, ques4, ques5, ques6, ques7, ques8,
                ques9, ques10, ques11, ques12, suitable
            });

            if (apiResp.statusCode === 200) {
                setMsg(apiResp.msg)
            } else {
                setMsg(apiResp.msg)
            }
            setIsApiLoading(false)
        } else {
            setMsg("Please fill the whole data")
        }

    }

    return (
        <div>

            {
                facultyDetails.isVerified === 0 ?
                    <div id='popUpBack' >
                        <div id='confirmationPopUp'>
                            <div id='title'>Confirm Your Details</div>
                            <div className='details'><span>Name :- </span>{facultyDetails.name}</div>
                            <div className='details'><span>Email :- </span>{facultyDetails.email}</div>
                            <div className='details'><span>Department :- </span>{facultyDetails.department}</div>
                            <div id='confirmBtn' onClick={handleConfirmBtn} >Confirm</div>
                            <div id="popUpError">{error}</div>
                            <div id='socialLink'>
                                If your Details is not correct contact here
                                <br />
                                <a href={"mailto:" + contactEmail} target="_blank" >
                                    {contactEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                    : null
            }

            <div id="error">{error}</div>
            <Loader
                isLoading={isGetApiLoading}
            />

            <div id='title'>Marks Not Given</div>
            <Table
                candidatesData={notMarksGivenCandidates}
                cellClick={cellClick}
            />




            <div id='title'>Marks Given</div>
            <Table
                candidatesData={marksGivenCandidates}
                cellClick={cellClick}
            />

            <Modal
                open={isModalOpen}
                closeOnOutsideClick={false}
                handleModalClose={handleModalClose}
            >
                <div id='backgroundDiv'>
                    <div id='title'>Candidate Details</div>
                    <div id='candidateInfoBox'>
                        <div className='candidateInfo'><b>Name :- </b>{candidateDetails.name}</div>
                        <div className='candidateInfo'><b>ApplicationNumber :- </b>{candidateDetails.applicationNumber}</div>
                        <div className='candidateInfo'><b>Email :- </b>{candidateDetails.email}</div>
                        <div className='candidateInfo'><b>Department :- </b>{candidateDetails.department}</div>
                        <div className='candidateInfo'><b>Designation :- </b>{candidateDetails.designation}</div>
                        <div className='candidateInfo'><b>Broad Area of Research Topic :- </b>{candidateDetails.researchTopic}</div>
                        <div className='candidateInfo'><b>Keyword1 :- </b>{candidateDetails.Keyword1}</div>
                        <div className='candidateInfo'><b>Keyword2 :- </b>{candidateDetails.Keyword2}</div>
                        <div className='candidateInfo'><b>Keyword3 :- </b>{candidateDetails.Keyword3}</div>
                        <div className='candidateInfo'><b>Keyword4 :- </b>{candidateDetails.Keyword4}</div>
                    </div>

                    <div id='questionBox'>
                        <div id='questionBoxTitle'>
                            <div id="titleQuestios">Questios</div>
                            <div id="titleMarks">Marks</div>
                        </div>
                        <form onSubmit={handleQuesMarksSubmit}>
                            {
                                questions.map((item, index) => (
                                    <div key={index}>
                                        <div className="questionRow">
                                            <div className='questions'>{"Q" + (index + 1) + ") "}{item.ques}</div>
                                            <div className='marks'>
                                                <select name={"ques" + (index + 1)} required className='marksDropDown'>
                                                    <option value="">0</option>
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                    <option>6</option>
                                                    <option>7</option>
                                                    <option>8</option>
                                                    <option>9</option>
                                                    <option>10</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div id='bottomOptions'>
                                <select id='suitable' name='suitable' required>
                                    <option value="">Suitable</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select> <br />
                                <button id='submitBtn'>Submit</button>
                                <div id='msg'>{msg}</div>
                                <Loader
                                    isLoading={isApiLoading}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default FacultyPage;
