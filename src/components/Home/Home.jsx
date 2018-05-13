import React, { Component } from 'react';
import { RaisedButton, FontIcon } from 'material-ui';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import * as octicons from 'octicons';
import { actions } from '../../redux/index';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.user || !this.props.user.login) {
      this.props.getUserData();
    }
  }

  renderButton() {
    if (this.props.user && this.props.user.login) {
      return <RaisedButton
        onClick={() => this.props.navigateToSearch()}
        label="Start Your Search"
        secondary={true}
      />
    } else {
      return (
        <div>
          <RaisedButton
            href="https://github.com/login/oauth/authorize?client_id=bf77f91ed090876cc930&scope="
            label="Start with Github OAuth"
            secondary={true}
          />
          <p>We use OAuth for public data only, expanding your own query limit to 6000+/hour!</p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="home">
        <div
          className="home__logo-wrapper"
          dangerouslySetInnerHTML={{
            __html: octicons['mark-github'].toSVG({ id: "home__logo", transform: 'rotate(180)' }),
          }} />
        <h1>buHtiG</h1>
        <h4>Go to N-th Commit of Github Repositories</h4>
        <h5>(Now supports <em>Branches</em>!)</h5>
        {this.renderButton()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: () => dispatch(actions.getUserData(false)), // don't navigate home on fail
    navigateToSearch: () => dispatch(push('/search')),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
