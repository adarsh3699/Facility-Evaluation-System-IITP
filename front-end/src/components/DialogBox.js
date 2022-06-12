import React from 'react';

function DialogBox({
    title,
    children
}) {
    return (
        <div id='popUpBack' >
            <div id='confirmationPopUp'>
                <div id='title'>{title}</div>
                { children }
            </div>
        </div>
    );
}

export default DialogBox;