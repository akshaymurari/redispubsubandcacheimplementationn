import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route,Switch} from "react-router";
import Chats from "./Chats/Chats";
function App() {
  return (
    <Switch>
      <Route path="/:name" exact component={Chats}/>
    </Switch>
  );
}

export default App;
