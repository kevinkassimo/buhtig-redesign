import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import CommitSelection from './CommitSelection';
import RepoValidation from './RepoValidation';
import ResultView from './ResultView';
import { actions } from '../../redux';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      repoState,
      submitRepo,
    } = this.props;

    return (
      <DocumentTitle title="buHtiG: Search">
        <div>
          {repoState.step === 0 &&
          <RepoValidation
            submitRepo={submitRepo} />
          }
          {repoState.step === 1 &&
          <CommitSelection />
          }
          {repoState.step === 2 &&
          <ResultView />
          }
        </div>
      </DocumentTitle>
    );
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
    submitRepo: (owner, repo, branch = '') => dispatch(actions.submitRepo(owner, repo, branch)),
    submitCommitSelection: (commit) => dispatch(actions.submitCommitSelection(commit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);