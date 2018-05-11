import React, { Component } from 'react';
import { AppBar, Avatar } from 'material-ui'
// import Avatar from 'material-ui/Avatar';

const HeaderRightIcon = ({ avatar }) => {
  return (
    <img src={avatar || '/user.png'} className="header__icon" />
  )
};

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar
        className="header"
        title="buHtiG"
        iconElementRight={<Avatar src={this.props.avatar || '/user.png'} />}
        />
    )
  }
}

export default Header;