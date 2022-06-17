import React, { useState, useEffect } from 'react';
import { apiCall, getCookie, DEPARTMENT, userTypeAdmin } from "../utils";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import Table from "../components/Table";

import "../css/adminPage.css";

const userId = getCookie("userId")

function AdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [isApiLoading, setApiLoading] = useState(false);
    const [isDepartmentVisible, setIsDepartmentVisible] = useState(true);
    const [candidatesData, setCandidatesData] = useState([]);

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeAdmin) {
            document.location.href = "/";
            return;
        }
    }, []);

    async function handleDepartmentClick(department) {
        if (department) {
            setApiLoading(true);
            const apiResp = await apiCall("candidate/by-department?department=" + department);
            if (apiResp.statusCode === 200) {
                setIsDepartmentVisible(false)
                setCandidatesData(apiResp.data)
            } else {
                console.log(apiResp.msg)
            }
            setApiLoading(false);
        }
    }

    function handleLeftArrowBtnClick() {
        if (isDepartmentVisible == false) {
            setIsDepartmentVisible(true)
        } 
    }

    function handleRightArrowBtnClick() {
        if (candidatesData.length !== 0) {
            if (isDepartmentVisible == true) {
                setIsDepartmentVisible(false)
            }
        }
    }

    async function handleCandidatesClick(email) {
        console.log(email);
        setIsModalOpen(true);
    }

    return (
        <div>
            <div id='title'>
                <div className='arrowBtn' onClick={handleLeftArrowBtnClick}>{"<-"}</div>
                Admin Page
                <div className='arrowBtn' onClick={handleRightArrowBtnClick}>{"->"}</div>
            </div>

            <Loader isLoading={isApiLoading} />
            {
                isDepartmentVisible ?
                    <div className='table'>
                        <div id='tableTitle'>Department</div>
                        {
                            DEPARTMENT.map((item, index) => (
                                <div className='rows' key={index} onClick={() => handleDepartmentClick(item)}>{item}</div>
                            ))
                        }
                    </div>
                    :
                    null
            }

            {
                isDepartmentVisible ?
                    null :
                    <Table candidatesData={candidatesData} onTableRowClick={handleCandidatesClick} />
            }

            <Modal
                open={isModalOpen}
                closeOnOutsideClick={false}
                handleModalClose={() => setIsModalOpen(false)}
            >
                <div id='backgroundDiv'>
                    <div id='title'>Candidate Details</div>
                </div>
            </Modal>

        </div>
    );
}

export default AdminPage;
