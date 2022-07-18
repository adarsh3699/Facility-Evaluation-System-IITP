import React, { useState, useEffect } from 'react';
import { API_BASE_URL, apiCall, getCookie, createCookie, DEPARTMENT, userTypeAdmin } from "../utils";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import "../css/table.css";
import "../css/adminPage.css";

const userId = getCookie("userId")

function AdminPage() {
    const [error, setError] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidatesData, setCandidatesData] = useState([]);

    useEffect(() => {
        if (!userId || getCookie("userType") !== userTypeAdmin) {
            document.location.href = "/";
            return;
        }
    }, []);

    function handleLogoutBtnClick() {
        createCookie("userId", "");
        createCookie("userType", "");
        document.location.href = "/";
    }

    function handlesummarySheetClick(department) {
        if (department) {
            window.open(API_BASE_URL + "generate-pdf/summary-sheet/" + department+ "-summary-sheet");
        }
    }

    async function handleDetailSheetClick(department) {
        setIsModalOpen(true);
        setCandidatesData([])
        if (department) {
            setApiLoading(true);
            const apiResp = await apiCall("candidate/by-department?department=" + department);
            if (apiResp.statusCode === 200) {
                setCandidatesData(apiResp.data)
            } else {
                console.log(apiResp.msg)
                setError(apiResp.msg)
            }
            setApiLoading(false);
        }
    }

    async function handleCandidatesClick(index) {
        const { name = "", department = "", phoneNo = ""} = candidatesData[index];

        let facToReviewCount = 0;
        for (let i = 1; i <= 40; i++) {
            facToReviewCount = facToReviewCount + (candidatesData[index]["f" + i] ? 1 : 0);
        }

        const data = { ...candidatesData[index], facToReviewCount};
        const fileName = name + "-" + department + "-" + phoneNo + "-detail-sheet";
        window.open(API_BASE_URL + "generate-pdf/detail-sheet/" + fileName + "?data=" + btoa(JSON.stringify(data)));
    }

    return (
        <div>
            <div id="error">{error}</div>
            <div id='title'>Admin Page</div>

            <div className='table'>
                <div id='tableTitle'>
                    <div id='titleDepartment'>Department</div>
                    <div id='titleDownload'>Download</div>
                </div>
                {
                    DEPARTMENT.map((item, index) => (
                        <div className='rows' key={index} >
                            <div className='department'>{item}</div>
                            <div className='summarySheet' onClick={() => handlesummarySheetClick(item)}>Summary Sheet</div>
                            <div className='detailSheet' onClick={() => handleDetailSheetClick(item)}>Detail Sheet</div>
                        </div>
                    ))
                }
            </div>
            <div id='logOut'><span onClick={handleLogoutBtnClick}>Log Out</span></div>

            <Modal
                open={isModalOpen}
                closeOnOutsideClick={false}
                handleModalClose={() => setIsModalOpen(false)}
            >
                <div id='backgroundDiv'>
                    <Loader isLoading={isApiLoading} />
                    <div id='title'>Admin Details</div>

                    <div className='table'>
                        <div id='tableTitle'>
                            <div id='title-1'>Name</div>
                            <div id='title-2'>Application Number</div>
                            <div id='title-3'>Attendance</div>
                        </div>
                        {
                            candidatesData.map((item, index) => (
                                <div className='rows' key={index} onClick={() => handleCandidatesClick(index)}>
                                    <div className='col-1'>{item.name}</div>
                                    <div className='col-2'>{item.applicationNumber}</div>
                                    <div className='col-3'>{item.presentCount >= item.absentCount ? "Present" : "Absent"}</div>
                                </div>
                            ))
                        }
                    </div>

                    <div id='backToHome' onClick={() => setIsModalOpen(false)}>Back To Home</div>
                </div>
            </Modal>
        </div>
    );
}

export default AdminPage;
