import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CommonHeader from './components/commons/CommonHeader';
import Quest from './routes/Quest';
import Stat from './routes/Stat';
import NoMatch from './routes/NoMatch';

class App extends Component {

  render () {
    return (
      <Router>
        <div>
          <CommonHeader/>
          <div>
            <Switch>
              <Route exact path="/" component={Stat}/>
              <Route exact path="/Quest" component={Quest}/>
              <Route exact path="/Stat" component={Stat}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
