import StagedIssuesTab from '../components/tabContents/StagedIssuesTab';
import LiveIssuesTab from '../components/tabContents/LiveIssuesTab';

export const AppTabs = [
    { title: 'Staged', key: 'staged', content:'StagedIssuesTab' },
    { title: 'Live Issues', key: 'live', content:'LiveIssuesTab' }
];

export const componentForTab = (tab) => {
    switch(tab.key) {
        case 'staged':
            return (<StagedIssuesTab/>);
        case 'live':
            return (<LiveIssuesTab/>);
        default:
            return null;
    }
}