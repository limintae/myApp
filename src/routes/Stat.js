import React, { Component } from 'react'
import Statistics from '../containers/Statistics';

import { Grid } from 'semantic-ui-react'

class Stat extends Component {
  render () {
    return (
      <div>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Statistics/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </div>
    )
  }
}

export default Stat
