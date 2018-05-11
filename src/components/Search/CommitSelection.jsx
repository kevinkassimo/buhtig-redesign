import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { actions } from '../../redux';

class CommitSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commit: '',
    };
  }

  validatePositiveNumberOrNothing = (number) => /^[0-9\b]*$/.test(String(number));

  validateCommitNumber = (number) => {
    let re = /^[0-9\b]+$/;
    if (re.test(String(number))) {
      let v = +number;
      return !(!v || v > (+this.props.repoState.total || -1));
    }
    return false;
  };

  render() {
    return (
      <div>
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
              this.props.submitCommit(+this.state.commit);
            }}>
            Next Step!
          </RaisedButton>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    notifyError: (message) => dispatch(actions.notifyError(message)),
  };
};

export default connect(null, mapDispatchToProps)(CommitSelection);
