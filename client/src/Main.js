import React, { useEffect, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';
import * as msteams from '@microsoft/teams-js';
import App from './App';
import { inTeams } from './utilities/TeamsUtils';


export const TeamsContext = createContext({ 'context': null, 'token': null });
TeamsContext.displayName = "TeamsContext";

export const WebContext = createContext({ 'context': "This is dummy context", 'token': null });
WebContext.displayName = "WebContext";

function Main() {
    const [teamsContext, setTeamsContext] = useState(null);
    const [teamsAuthToken, setTeamsAuthToken] = useState(null);


    useEffect(() => {

        async function getTeamsContext() {
            let isInsideTeams = await inTeams();
            if (isInsideTeams) {
                let ctx = await msteams.app.getContext();
                setTeamsContext(ctx);
            } else {
                setTeamsContext(null);
            }
        }

        getTeamsContext();
    }
        , []);

    useEffect(() => {
        async function performAuth() {
            console.log("...performAuth...")
            if (teamsContext == null) {
                console.log("...Skipping as teamsContext is null...")
                return;
            }
            console.log("...calling teams auth api...")
            let token = await msteams.authentication.getAuthToken();
            setTeamsAuthToken(token);
        }
        performAuth();
    }, [teamsContext]);

    return (
        <div>
            {
                teamsContext ? <TeamsAppWrapper context={teamsContext} token={teamsAuthToken} /> : <WebAppWrapper />
            }
        </div>
    );
}

function WebAppWrapper() {
    return (
        <WebContext.Provider value={{ 'context': "This is dummy context", 'token': null }}>
            <WebApp />
        </WebContext.Provider>
    );
}


function TeamsAppWrapper(props) {
    return (
        <TeamsContext.Provider value={{ 'context': props.context, 'token': props.token }}>
            <App />
        </TeamsContext.Provider>
    );
}

function WebApp() {
    const context = useContext(WebContext);
    return (
        <div>
            <h1>Not in MicrosoftTeams: {JSON.stringify(context)}</h1>
        </div>
    );
}

export default Main;
