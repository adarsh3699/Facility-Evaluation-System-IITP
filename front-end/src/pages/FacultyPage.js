import React, { useState, useEffect } from 'react';
import { getCookie, userTypeFaculty } from "../utils";

function FacultyPage() {

    useEffect(() => {
        if (!getCookie("userId") || getCookie("userType") !== userTypeFaculty) {
            document.location.href = "/";
            return;
        }
    }, []);

    return (
        <div>
           Hello Faculty
        </div>
    );
}

export default FacultyPage;
