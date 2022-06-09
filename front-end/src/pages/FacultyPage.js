import React, { useState, useEffect } from 'react';
import { getCookie, userTypeFaculty, apiCall } from "../utils";

import "../css/facultyPage.css"

const userId = getCookie("userId")

function FacultyPage() {

    const [confirmMsg, setConfirmMsg] = useState("");
    const [msg, setMsg] = useState("");

    const [facultyDetailc, setFacultyDetails] = useState({
        name: "",
        email: "",
        department: "",
        isVerified: ""
    });

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeFaculty) {
            document.location.href = "/";
            return;
        } else {
            (async function getData() {
                const apiResp = await apiCall("faculty", "post", { userId });
                if (apiResp.statusCode === 200) {

                    setFacultyDetails({
                        name: apiResp?.data[0]?.name,
                        email: apiResp?.data[0]?.email,
                        department: apiResp?.data[0]?.department,
                        isVerified: apiResp?.data[0]?.isVerified
                    });

                } else {
                    setMsg(apiResp.msg)
                }
            })();
        }
    }, []);

    async function handleConfirmBtn() {
        const apiResp = await apiCall("faculty/confirm", "post", { userId });
        if (apiResp.statusCode === 200) {
            setFacultyDetails({
                ...facultyDetailc,
                isVerified: 1,
            });
        } else {
            setConfirmMsg(apiResp.msg)
        }
    }

    return (
        <div>
            <div id='title'>Faculty Page</div>
            <div id='popUpBack' style={facultyDetailc.isVerified === 0 ? { display: "flex" } : { display: "none" }} >
                <div id='confirmationPopUp'>
                    <div id='title'>Confirm Your Details</div>
                    <div className='details'><span>Name :- </span>{facultyDetailc.name}</div>
                    <div className='details'><span>Email :- </span>{facultyDetailc.email}</div>
                    <div className='details'><span>Department :- </span>{facultyDetailc.department}</div>
                    <div id='confirmBtn' onClick={handleConfirmBtn} >Confirm</div>
                </div>
            </div>
        </div>
    );
}

export default FacultyPage;
