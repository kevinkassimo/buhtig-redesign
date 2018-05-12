import React, { Component } from 'react';
import CommitSelection from './CommitSelection';
import RepoValidation from './RepoValidation';
import ResultView from './ResultView';

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
    );
  }
}

export default Search;