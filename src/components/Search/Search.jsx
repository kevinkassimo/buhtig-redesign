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
      submitCommit,
      getNextCommit,
      getPrevCommit,

      goToPrevStep,
    } = this.props;

    return (
      <div>
        {repoState.step === 0 &&
          <RepoValidation
            repoState={repoState}
            submitRepo={submitRepo} />
        }
        {repoState.step === 1 &&
          <CommitSelection
            repoState={repoState}
            goBack={goToPrevStep}
            submitCommit={submitCommit} />
        }
        {repoState.step === 2 &&
          <ResultView
            goBack={goToPrevStep}
            getNextCommit={getNextCommit}
            getPrevCommit={getPrevCommit} />
        }
      </div>
    );
  }
}

export default Search;