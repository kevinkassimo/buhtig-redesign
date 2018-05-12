import React, { Component } from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { actions } from '../../redux';

class RepoValidation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: this.props.repoState.owner || '',
      repo: this.props.repoState.repo || '',
      branch: this.props.repoState.branch || '',
    };
  }

  render() {
    return (
      <div>
        <form>
          <TextField
            id="owner"
            label="Owner/Organization"
            value={this.state.owner}
            required
            placeholder="e.g. expressjs"
            onChange={({ target }) => this.setState({owner: target.value})}
            margin="normal"
          />
          <TextField
            id="repo"
            label="Repository Name"
            value={this.state.repo}
            required
            placeholder="e.g. express"
            onChange={({ target }) => this.setState({repo: target.value})}
            margin="normal"
          />
          <TextField
            id="branch"
            label="Branch Name"
            value={this.state.branch}
            placeholder="If left blank, default to master"
            onChange={({ target }) => this.setState({branch: target.value})}
            margin="normal"
          />
          <RaisedButton
            variant="raised"
            color="primary"
            disabled={!this.state.owner || !this.state.repo}
            onClick={() => {
              if (this.state.owner && this.state.repo) {
                this.props.submitRepo(this.state.owner, this.state.repo, this.state.branch)
              }
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
    notifyError: (message) => dispatch(actions.notifyError(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RepoValidation);