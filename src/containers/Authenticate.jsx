import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../redux';

export default (WrappedComponent) => {
  class AuthenticationWrapper extends Component {
    componentDidMount() {
      if (!this.props.user.login) {
        this.props.getUserData();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      getUserData: () => dispatch(actions.getUserData()),
    };
  };
  return connect(mapStateToProps, mapDispatchToProps)(AuthenticationWrapper)
}