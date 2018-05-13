import React, { Component } from 'react';
import { TextField, RaisedButton, Card } from 'material-ui';
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
      <Card className="searchcard">
        <form>
          <h1>Enter Repository Info</h1>
          <div>
            <TextField
              id="owner"
              floatingLabelText="Owner/Organization"
              label="Owner/Organization"
              value={this.state.owner}
              required
              hintText="e.g. expressjs"
              onChange={({ target }) => this.setState({owner: target.value})}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="repo"
              floatingLabelText="Repository Name"
              label="Repository Name"
              value={this.state.repo}
              required
              hintText="e.g. express"
              onChange={({ target }) => this.setState({repo: target.value})}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="branch"
              floatingLabelText="Branch Name"
              label="Branch Name"
              value={this.state.branch}
              hintText="If left blank, default to master"
              onChange={({ target }) => this.setState({branch: target.value})}
              margin="normal"
            />
          </div>
          <div>
            <RaisedButton
              secondary={true}
              label="Validate Repo"
              className="searchcard__button"
              disabled={!this.state.owner || !this.state.repo}
              onClick={() => {
                if (this.state.owner && this.state.repo) {
                  this.props.submitRepo(this.state.owner, this.state.repo, this.state.branch)
                }
              }}
            />
          </div>
        </form>
      </Card>
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