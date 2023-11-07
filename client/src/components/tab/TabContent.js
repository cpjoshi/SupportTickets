
import {componentForTab} from '../../models/AppTabsModel'

const TabContent = ({ tab, key, actionHandler }) => {
    return (
        componentForTab(tab, key, actionHandler)
    );
};

export { TabContent };