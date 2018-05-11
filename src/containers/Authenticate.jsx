import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { actions } from '../redux';

export default (WrappedComponent) => {
  class AuthenticationWrapper extends Component {
    componentDidMount() {
      if (!this.props.user.login) {
        this.props.getUserData();

        // this.props.navigateToHome();
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
      navigateToHome: () => dispatch(push('/')),
    };
  };
  return connect(mapStateToProps, mapDispatchToProps)(AuthenticationWrapper)
}