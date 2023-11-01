
import {componentForTab} from '../../models/AppTabsModel'

const TabContent = ({ tab }) => {
    return (
        componentForTab(tab)
    );
};

export { TabContent };