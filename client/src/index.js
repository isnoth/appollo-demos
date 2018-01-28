import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


/*react router*/
import { HashRouter as Router } from "react-router-dom";
import createBrowserHistory from 'history/createHashHistory';
const history = createBrowserHistory()

const RouterWrappedApp = ()=>{
  return <Router history={history}>
      <App />
    </Router>
}

ReactDOM.render(<RouterWrappedApp />, document.getElementById('root'));
registerServiceWorker();
