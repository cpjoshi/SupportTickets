import React, { useEffect } from "react";
const TabContent = ({ tab }) => {

    useEffect(() => {
        console.log("TabContent Mounted: " + tab.title);
    }, [tab]);

    return (
        <div className="content">
            <h1>Initial Tab: {tab.title}</h1> 
        </div>
    );
};

export { TabContent };
