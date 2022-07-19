import React, { useState, useEffect } from 'react';
import {
    getCookie, createCookie, userTypeFaculty, apiCall,
    CONTACT_EMAIL, QUESTIONS, QUESTION_OPTIONS, CANDIDATE_INFO
} from "../utils";
import Modal from "../components/Modal";
import Table from "../components/Table";
import Loader from "../components/Loader";
import DialogBox from "../components/DialogBox";

import "../css/facultyPage.css"

const userId = getCookie("userId")

function FacultyPage() {

    const [isYesNoModalOpen, setIsYesNoModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalQstnMarks, setTotalQstnMarks] = useState(0);
    const [quesMarks, setQuesMarks] = useState({});
    const [alreadySubmit, setAlreadySubmit] = useState(false);
    const [isPresent, setisPresent] = useState(true);
    const [isSuitable, setisSuitable] = useState("");

    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);

    const [facultyDetails, setFacultyDetails] = useState({});
    const [selectedCandidateDetails, setSelectedCandidateDetails] = useState({});
    const [notMarksGivenCandidates, setNotMarksGivenCandidates] = useState([]);
    const [marksGivenCandidates, setMarksGivenCandidates] = useState([]);

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeFaculty) {
            document.location.href = "/";
            return;
        } else {
            setIsApiLoading(true);
            (async function getData() {
                const apiResp = await apiCall("faculty", "post", { userId });
                if (apiResp.statusCode === 200) {
                    const { facDetails = {}, candDetails = [] } = apiResp?.data || {};
                    setFacultyDetails(facDetails);

                    setMarksGivenCandidates(candDetails.filter(item => (item.questionMarksId ? true : false)));
                    setNotMarksGivenCandidates(candDetails.filter(item => (item.questionMarksId ? false : true)));
                    // setNotMarksGivenCandidates(candDetails.filter((item) => (item.questionMarksId ? false : true)));
                    // const key = "name"; facultyDetails[key];
                } else {
                    setError(apiResp.msg);
                }
                setIsApiLoading(false);
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

    async function handleTableRowClick(email, questionMarksId) {
        setIsModalOpen(true);
        setSelectedCandidateDetails({});
        setQuesMarks({});
        setTotalQstnMarks(0);
        setisSuitable("")
        setAlreadySubmit(false)
        setMsg("");

        if (questionMarksId) {
            setAlreadySubmit(true)
            setMsg("You can Only Submit Once");
        }

        const apiResp = await apiCall("candidate/by-email", "post", { candEmail: email, facEmail: facultyDetails.email });
        if (apiResp.statusCode === 200) {
            setSelectedCandidateDetails(apiResp?.data?.candDetails)
            setQuesMarks(apiResp?.data?.candMarks)

            if (questionMarksId) {
                if (apiResp?.data?.candMarks?.q1 && apiResp?.data?.candMarks?.q12 && apiResp?.data?.candMarks?.absentOrPresent) {
                    let total = 0;
                    for (let i = 1; i <= 12; i++) {
                        total += apiResp?.data?.candMarks?.["q" + i]
                    }
                    setTotalQstnMarks(total)
                    setisSuitable(apiResp?.data?.candMarks?.suitable)

                    if (apiResp?.data?.candMarks?.absentOrPresent === "Present") {
                        setisPresent(true)
                        console.log("true");
                    }
                } else if (apiResp?.data?.candMarks?.absentOrPresent === "Absent") {
                    setisPresent(false)
                    console.log("false");
                }
            }

        } else {
            setError(apiResp.msg)
        }
    }

    function handleQuesMarksChange() {
        let total = 0;

        for (let i = 1; i <= QUESTIONS.length; i++) {
            total += +(document?.getElementsByName("ques" + i)?.[0]?.value);
        }
        setTotalQstnMarks(total);

    }

    function handleAbsentOrPresentDropDown(e) {
        if (e.target.value === "Absent") {
            setisPresent(false)
        } else if (e.target.value === "Present") {
            setisPresent(true)
        }
    }

    function handleMarksSubmitBtn(e) {
        e.preventDefault();
        setIsYesNoModalOpen(true)
    }

    async function handleYesBtnClick() {
        const qstnsMarks = [];
        for (let i = 1; i <= QUESTIONS.length; i++) {
            qstnsMarks.push(document?.getElementsByName("ques" + i)?.[0]?.value);
        }
        const suitable = document?.getElementById("suitable")?.value;
        setIsYesNoModalOpen(false);

        setIsApiLoading(true);
        const apiResp = await apiCall("faculty/submit-marks", "post", {
            candEmail: selectedCandidateDetails.email,
            facName: facultyDetails.name,
            facEmail: facultyDetails.email,
            qstnsMarks,
            suitable,
            absentOrPresent: (isPresent ? "Present" : "Absent")
        });

        if (apiResp.statusCode === 200) {
            setMsg(apiResp.msg)
        } else {
            setMsg(apiResp.msg)
        }
        setIsApiLoading(false)
    }

    function handleLogoutBtnClick() {
        createCookie("userId", "");
        createCookie("userType", "");
        document.location.href = "/";
    }

    return (
        <div>

            {
                facultyDetails.isVerified === 0 ?
                    <DialogBox title="Confirm Your Details" >
                        <>
                            <div className='details'><span>Name :- </span>{facultyDetails.name}</div>
                            <div className='details'><span>Email :- </span>{facultyDetails.email}</div>
                            <div className='details'><span>Department :- </span>{facultyDetails.department}</div>
                            <div id='confirmBtn' onClick={handleConfirmBtn} >Confirm</div>
                            <div id="popUpError">{error}</div>
                            <div id='socialLink'>
                                If your Details is not correct contact here
                                <br />
                                <a href={"mailto:" + CONTACT_EMAIL} target="_blank">{CONTACT_EMAIL}</a>
                            </div>
                        </>
                    </DialogBox>
                    : null
            }

            <div id="error">{error}</div>
            <Loader isLoading={isApiLoading} />

            <div id='title'>Marks Not Given</div>
            <Table candidatesData={notMarksGivenCandidates} onTableRowClick={handleTableRowClick} />

            <div id='title'>Marks Given</div>
            <Table candidatesData={marksGivenCandidates} onTableRowClick={handleTableRowClick} />

            <Modal
                open={isModalOpen}
                closeOnOutsideClick={false}
                handleModalClose={() => setIsModalOpen(false)}
            >
                <div id='backgroundDiv'>
                    <div id='title'>Candidate Details</div>
                    <div id='candidateInfoBox'>
                        {
                            CANDIDATE_INFO.map(item => (
                                <div key={item.key} className='candidateInfo'>
                                    <b>{item.title} :- </b> {selectedCandidateDetails[item.key]}
                                </div>
                            ))
                        }
                    </div>

                    <div id='questionBox'>
                        <div id='questionBoxTitle'>
                            <div id="titleQuestios">Questios</div>
                            <div id="titleMarks">Marks</div>
                        </div>
                        <form onSubmit={handleMarksSubmitBtn}>
                            {
                                QUESTIONS.map((item, index) => (
                                    <div key={index}>
                                        <div className="questionRow">
                                            <div className='questions'>{"Q" + (index + 1) + ") "}{item.ques}</div>
                                            <div className='marks'>
                                                {
                                                    alreadySubmit ?
                                                        quesMarks["q" + (index + 1)]
                                                        :
                                                        <select
                                                            required={isPresent}
                                                            name={"ques" + (index + 1)}
                                                            onChange={handleQuesMarksChange}
                                                            className='marksDropDown'
                                                        >
                                                            <option value="">0</option>
                                                            {QUESTION_OPTIONS.map(item => (<option key={item} value={item}>{item}</option>))}
                                                        </select>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                            <div>
                                <div className="questionRow">
                                    <div className='questions'><b>Total :- </b></div>
                                    <div className='marks'><b>{totalQstnMarks}</b></div>
                                </div>
                            </div>

                            <div id='bottomOptions'>
                                <select id='present' value={alreadySubmit ? (isPresent ? "Present" : "Absent") : undefined} onChange={handleAbsentOrPresentDropDown} required>
                                    <option value="">Is Present</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                                <select id='suitable' name='suitable' value={alreadySubmit ? isSuitable : undefined} onChange={() => { }} required={isPresent}>
                                    <option value="">Suitable</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select> <br />
                                <button id='submitBtn' className={alreadySubmit ? "submitBtnDisable" : undefined}>Submit</button>
                            </div>
                        </form>
                        <div id='msg'>{msg}</div>
                        <Loader isLoading={isApiLoading} />
                        <div id='backToHome' onClick={() => setIsModalOpen(false)}>Back To Home</div>
                    </div>

                    {
                        isYesNoModalOpen ?
                            <DialogBox title="Are You Sure?" >
                                <div id='rUSureBtns'>
                                    <div id='noBtn' onClick={() => setIsYesNoModalOpen(false)}>No</div>
                                    <div id='yesBtn' onClick={handleYesBtnClick}>Yes</div>
                                </div>
                            </DialogBox>
                            :
                            null
                    }
                </div>
            </Modal>
            <div id='logOut'><span onClick={handleLogoutBtnClick}>Log Out</span></div>
        </div>
    );
}

export default FacultyPage;
