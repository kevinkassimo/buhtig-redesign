import React, { Component } from 'react';
import { Navbar, NavItem, NavbarBrand, NavLink } from 'reactstrap';
import styled from 'styled-components';

const FooterDiv = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
`;

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FooterDiv>
        <div>TEST</div>
      </FooterDiv>
    );
  }
}

export default Footer;