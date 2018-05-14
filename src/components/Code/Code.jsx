import React, { Component } from 'react';
import { actions } from '../../redux/index'
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

class Code extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    this.props.completeOAuth(this.props.code);
  }

  render() {
    return (
      <DocumentTitle title="buHtiG: Verifying...">
        <div />
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.login,
    avatar: state.user.avatar,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    completeOAuth: (code) => {
      dispatch(actions.completeOAuth(code))
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Code);