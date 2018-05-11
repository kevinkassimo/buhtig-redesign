import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <RaisedButton
          href="https://github.com/login/oauth/authorize?client_id=bf77f91ed090876cc930&scope="
          label="Start"
          secondary={true}
          // style={styles.button}
          icon={<FontIcon className="muidocs-icon-custom-github" />}
        />
        {/*<a href="https://github.com/login/oauth/authorize?client_id=bf77f91ed090876cc930&scope=">OAuth</a>*/}
      </div>
    )
  }
}

export default Home;