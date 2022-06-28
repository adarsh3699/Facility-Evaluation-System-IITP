import React, { useState, useEffect } from 'react';
import { apiCall, getCookie, createCookie, DEPARTMENT, userTypeAdmin } from "../utils";
import Loader from "../components/Loader";

import "../css/adminPage.css";

const userId = getCookie("userId")

function AdminPage() {
    const [msg, setMsg] = useState("");
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

    // async function handleDepartmentClick(department) {
    //     if (department) {
    //         setApiLoading(true);
    //         const apiResp = await apiCall("candidate/by-department?department=" + department);
    //         if (apiResp.statusCode === 200) {
    //             setIsDepartmentVisible(false)
    //             setCandidatesData(apiResp.data)
    //         } else {
    //             console.log(apiResp.msg)
    //         }
    //         setApiLoading(false);
    //     }
    // }

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
                            <div className='summarySheet'>Summary Sheet</div>
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
