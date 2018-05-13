import React, { Component } from 'react';
import { TextField, RaisedButton, Card } from 'material-ui';
import { connect } from 'react-redux';
import { actions } from '../../redux';

class CommitSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commit: props.repoState.commit ? String(props.repoState.commit) : '',
    };
  }

  validatePositiveNumberOrNothing = (number) => /^[0-9]*$/.test(String(number));

  validateCommitNumber = (number) => {
    let re = /^[0-9]+$/;
    if (re.test(String(number))) {
      let v = +number;
      return !(!v || v > (+this.props.repoState.total || -1));
    }
    return false;
  };

  render() {
    const {
      repoState,

      submitCommitSelection,
      goBack,
    } = this.props;

    console.log(goBack);

    return (
      <div>
        <Card className="searchcard">
          <h1>Enter Commit Number</h1>
          <h4>For "{repoState.owner}/{repoState.repo}"</h4>
          <h4>On branch "{repoState.sha || 'master'}"</h4>
          <h4>There are {repoState.total} commits in total</h4>
          <form>
            <div>
              <TextField
                id="commit"
                floatingLabelText="Commit Number (default to 1)"
                value={this.state.commit}
                required
                hintText="e.g. 1 (for first commit)"
                onChange={({ target }) => {
                  if (this.validatePositiveNumberOrNothing(target.value)) {
                    this.setState({commit: String(target.value)});
                  }
                }}
                margin="normal"
              />
            </div>
            <div>
              <RaisedButton
                secondary={true}
                label="Search"
                className="searchcard__button"
                disabled={!this.validateCommitNumber(String(this.state.commit))}
                onClick={() => {
                  submitCommitSelection(+this.state.commit);
                }}
              />
            </div>
          </form>
        </Card>
        <RaisedButton
          secondary={true}
          label="Back"
          className="searchcard__backButton"
          onClick={() => goBack()}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    repoState: state.repo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    goBack: () => dispatch(actions.goToPrevStep()),
    submitCommitSelection: (commit) => dispatch(actions.submitCommitSelection(commit)),
    notifyError: (message) => dispatch(actions.notifyError(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommitSelection);
