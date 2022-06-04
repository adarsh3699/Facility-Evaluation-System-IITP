import React, { useEffect } from 'react';
import { getCookie, userTypeCandid } from "../utils";

function CandidatePage() {

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeCandid) {
            document.location.href = "/";
            return;
        }
    }, []);

    return (
        <div>
           Hello Candidate
        </div>
    );
}

export default CandidatePage;
