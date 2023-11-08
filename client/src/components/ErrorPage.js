import React from 'react';
import {getFullPageErrorInfo} from '../models/ErrorModel';

function ErrorPage({ fullpageError, actionHandler}) {
    const { icon, title, description, actionTitle } = getFullPageErrorInfo(fullpageError);
    return (
        <div className="error-page">
            <img src={icon} alt="error icon" />
            <h1>{title}</h1>
            <p>{description}</p>
            {actionTitle && <button onClick={actionHandler}>{actionTitle}</button>}
        </div>
    );
}

export default ErrorPage;