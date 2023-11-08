import StagedIssuesTab from '../components/tabContents/StagedIssuesTab';
import LiveIssuesTab from '../components/tabContents/LiveIssuesTab';

export const AppTabs = [
    { title: 'Staged', key: 'staged' },
    { title: 'Live Issues', key: 'live' }
];

export const componentForTab = (tab, actionHandler) => {
    switch (tab.key) {
        case 'staged':
            return (<StagedIssuesTab actionHandler={actionHandler} />);
        case 'live':
            return (<LiveIssuesTab actionHandler={actionHandler}/>);
        default:
            return null;
    }
}


