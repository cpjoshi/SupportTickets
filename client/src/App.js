// App.js
import * as microsoftTeams from '@microsoft/teams-js';
import React, { useState, useEffect, useContext } from 'react';
import IssueForm from './forms/IssueForm';
import './App.css';
import { TeamsContext } from './Main';
import TabBar from './components/tab/TabBar';
import {AppTabs} from './models/AppTabsModel'
import { Tab } from './components/tab/Tab';
import { TabContent } from './components/tab/TabContent';

const App = () => {
  return (
    <div className="app-container">
      <Tab>
      {AppTabs.map((tab, index) => (
        <TabContent tab={tab} key={index}>
        </TabContent>
      ))}
      </Tab>
    </div>
  );
};

export default App;
