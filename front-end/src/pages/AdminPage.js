import React, { useState, useEffect } from 'react';
import { API_BASE_URL, getCookie, createCookie, DEPARTMENT, userTypeAdmin } from "../utils";
import Loader from "../components/Loader";

import "../css/adminPage.css";

const userId = getCookie("userId")

function AdminPage() {
    const [isApiLoading, setApiLoading] = useState(false);

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeAdmin) {
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
            window.open(API_BASE_URL + "generate-pdf/summary?dept=" + department);
            // const apiResp = await apiCall("http://localhost:4000/generate-pdf/summary?dept=" + department);
        }
    }

    return (
        <div>
            <div id='title'>Admin Page</div>

            <Loader isLoading={isApiLoading} />
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
                            <div className='detailSheet'>Detail Sheet</div>
                        </div>
                    ))
                }
            </div>

            <div id='logOut'><span onClick={handleLogoutBtnClick}>Log Out</span></div>
        </div>
    );
}

export default AdminPage;
