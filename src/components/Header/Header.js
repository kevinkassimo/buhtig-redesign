import React, { Component } from 'react';
import { Navbar, NavItem, NavbarBrand, NavLink } from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar color="light">
        <NavbarBrand href="#">buHtiG</NavbarBrand>
        <NavItem>
          <NavLink href="https://github.com/kevinkassimo/buhtig">Github</NavLink>
        </NavItem>
      </Navbar>
    );
  }
}

export default Header;