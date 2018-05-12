import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
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
        <RaisedButton
          variant="raised"
          color="primary"
          onClick={() => goBack()}>
          Back
        </RaisedButton>
        <h3>On branch "{repoState.sha || 'master'}"</h3>
        <h3>Total commit count: {repoState.total}</h3>
        <form>
          <TextField
            id="commit"
            label="Commit Number (default to 1)"
            value={this.state.commit}
            required
            placeholder="e.g. 1 (for first commit)"
            onChange={({ target }) => {
              if (this.validatePositiveNumberOrNothing(target.value)) {
                this.setState({commit: String(target.value)});
              }
            }}
            margin="normal"
          />
          <RaisedButton
            variant="raised"
            color="primary"
            disabled={!this.validateCommitNumber(String(this.state.commit))}
            onClick={() => {
              submitCommitSelection(+this.state.commit);
            }}>
            Next Step!
          </RaisedButton>
        </form>
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
