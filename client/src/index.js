import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import MyStringStore from "./contracts/MyStringStore.json";

// let drizzle know what contracts we want
const options = { contracts: [MyStringStore] };

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render((
  <DrizzleContext.Provider drizzle={drizzle}>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </DrizzleContext.Provider>
), document.getElementById('root'));
registerServiceWorker();
