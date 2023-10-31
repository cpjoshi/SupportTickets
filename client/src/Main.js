import React, { useEffect, useState, createContext } from 'react';
import App from './App';
import { inTeams } from './utilities/TeamsUtils';
import * as msteams from '@microsoft/teams-js';


export const TeamsContext = createContext({ 'context': null, 'token': null });
TeamsContext.displayName = "TeamsContext";

function Main() {
    const [teamsContext, setTeamsContext] = useState(null);
    const [teamsAuthToken, setTeamsAuthToken] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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

    }, []);

    useEffect(() => {
        async function performAuth() {
            if (teamsContext == null) {
                return;
            }
            let token = await msteams.authentication.getAuthToken();
            setTeamsAuthToken(token);
        }
        performAuth();

    }, [teamsContext]);

    const WebPage = () => <h1>Not running in MicrosoftTeams</h1>
    
    return (
        <div>
            {
                teamsContext ? <TeamsAppWrapper context={teamsContext} token={teamsAuthToken} /> : WebPage()
            }
        </div>
    );
}

function TeamsAppWrapper(props) {
    return (
        <TeamsContext.Provider value={{ 'context': props.context, 'token': props.token }}>
            <App />
        </TeamsContext.Provider>
    );
}

export default Main;
