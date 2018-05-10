import React, { Component } from 'react';
import { Card } from 'reactstrap';
import styled from 'styled-components';

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Card>
          Card
        </Card>
        <a href="https://github.com/login/oauth/authorize?client_id=bf77f91ed090876cc930&scope=&">OAuth</a>
      </div>
    )
  }
}

export default Home;