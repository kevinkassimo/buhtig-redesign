import React, { Component } from 'react';
import { FloatingActionButton, RaisedButton } from 'material-ui';
import { ContentForward, ContentUndo } from 'material-ui/svg-icons'
import { connect } from 'react-redux';
import { actions } from '../../redux';

class ResultView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      repoState,
      browseCommit,
      goBack,
    } = this.props;
    const entry = repoState.cache[repoState.cacheIndex];

    return (
      <div>
        <RaisedButton
          variant="raised"
          color="primary"
          onClick={() => goBack()}>
          Back
        </RaisedButton>
        <FloatingActionButton
          disabled={repoState.commit <= 1}
          onClick={() => browseCommit(repoState.commit - 1)}>
          <ContentUndo />
        </FloatingActionButton>
        <div>
          <img src={entry.author.avatar_url} alt="author avatar" />
          <p>{entry.author.login}</p>
        </div>
        {entry.author.login !== entry.committer.login &&
        <div>
          <img src={entry.committer.avatar_url} alt="committer avatar" />
          <p>{entry.committer.login}</p>
        </div>
        }
        <div>
          <p>{entry.commit.message}</p>
          <RaisedButton
            variant="raised"
            color="primary"
            href={entry.html_url}
            target="_blank">
            View Commit Details
          </RaisedButton>
        </div>
        <div>
          <p>(Github's CSP settings rejects displaying iframe, sorry for the inconvenience)</p>
        </div>
        <FloatingActionButton
          disabled={repoState.commit >= repoState.total}
          onClick={() => browseCommit(repoState.commit + 1)}>
          <ContentForward />
        </FloatingActionButton>
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
    browseCommit: (commit) => dispatch(actions.browseCommit(commit)),
    notifyError: (message) => dispatch(actions.notifyError(message)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultView);
