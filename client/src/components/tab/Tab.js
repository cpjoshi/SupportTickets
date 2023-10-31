import React, { useState, createContext, Children } from 'react';
import TabBar from './TabBar';
import { TabContent } from './TabContent';
// Create a context for the active tab
export const TabContext = createContext({});

const Tab = ({ children }) => {
    const [activeTab, setActiveTab] = useState({ title: 'def-title', key: 'def-key', content: 'def-content' });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const arrayOfChildren = Children.toArray(children);
    const tabs = arrayOfChildren.map((child, index) => {
        return child.props.tab;
    }
    );

    return (
        <div>
        <TabContext.Provider value={activeTab}>
        <TabBar tabs={tabs} onTabChange={handleTabChange} />
            {
             tabs.map((tab, index) => {
                return (
                    activeTab.key === tab.key ? <TabContent tab={tab}/> : null
                );   
            })}
        </TabContext.Provider>
        </div>
    );
};

export { Tab };