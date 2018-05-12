import React, { Component } from 'react';
import { AppBar, Avatar } from 'material-ui'
import { connect } from 'react-redux';

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

const mapStateToProps = (state) => {
  return {
    avatar: state.user.avatar || null,
  };
};

export default connect(mapStateToProps)(Header)