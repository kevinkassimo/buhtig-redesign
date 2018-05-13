import React, { Component } from 'react';
import { AppBar, Avatar, IconButton } from 'material-ui'
import { connect } from 'react-redux';
import * as octicons from 'octicons';
import { actions } from '../../redux/index';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar
        className="header"
        title="buHtiG"
        iconElementLeft={
          <IconButton style={{ padding: 0 }} onClick={() => this.props.clearDataAndNavigateHome()}>
          <span
            dangerouslySetInnerHTML={{
              __html: octicons['mark-github'].toSVG({ width: 40, transform: 'rotate(180)' }),
            }} />
          </IconButton>}
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

const mapDispatchToProps = (dispatch) => {
  return {
    clearDataAndNavigateHome: () => dispatch(actions.clearDataAndNavigateHome()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)