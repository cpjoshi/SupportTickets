import StagedIssuesTab from '../components/tabContents/StagedIssuesTab';
import LiveIssuesTab from '../components/tabContents/LiveIssuesTab';
import IssueForm from '../forms/IssueForm';
export const AppTabs = [
    { title: 'Staged', key: 'staged' },
    { title: 'Live Issues', key: 'live' },
    { title: 'Create New Issue', key: 'form' }
];

export const componentForTab = (tab) => {
    switch (tab.key) {
        case 'staged':
            return (<StagedIssuesTab />);
        case 'live':
            return (<LiveIssuesTab />);
        case 'form':
            return (<IssueForm />);
        default:
            return null;
    }
}