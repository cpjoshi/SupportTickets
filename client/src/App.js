import './App.css';
import { AppTabs } from './models/AppTabsModel'
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
