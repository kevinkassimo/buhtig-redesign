import React, { Component } from 'react';
import { FloatingActionButton, RaisedButton, Avatar, Card } from 'material-ui';
import { NavigationChevronLeft, NavigationChevronRight } from 'material-ui/svg-icons'
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
    const author = entry.commit.author || entry.commit.committer; // move committer to author if author not exist
    const authorGithubInfo = entry.author || entry.committer; // move committer to author if author not exist
    const authorHasGithubAccount = !!(authorGithubInfo && authorGithubInfo.avatar_url);
    const committer = entry.commit.committer;
    const committerGithubInfo = entry.committer;
    const committerHasGithubAccount = !!(committerGithubInfo && committerGithubInfo.avatar_url);
    const commitTime = committer ? committer.date : (author ? author.date : null);

    return (
      <div>
        <RaisedButton
          secondary={true}
          label="Back"
          className="searchcard__backButton"
          onClick={() => goBack()}
        />
        <FloatingActionButton
          disabled={repoState.commit <= 1}
          className="searchcard__leftButton"
          onClick={() => browseCommit(repoState.commit - 1)}>
          <NavigationChevronLeft />
        </FloatingActionButton>
        <Card className="searchcard">
          <form>
            <h3>Commit #{repoState.commit}</h3>
            <p>{repoState.owner}/{repoState.repo} on "{repoState.branch || 'master'}"</p>
            <div className="searchcard__flex">
              {author &&
                <div>
                  <Avatar
                    src={authorGithubInfo ? (authorGithubInfo.avatar_url || '/user.png') : '/user.png'}
                    className="searchcard__avatar"
                    alt="author avatar" />
                  <h4>{author.name}{
                    authorHasGithubAccount &&
                    <a href={authorGithubInfo.html_url} target="_blank"> @{authorGithubInfo.login}</a>}</h4>
                </div>
              }
              {committer && committerGithubInfo && authorGithubInfo
                && committerGithubInfo.login !== authorGithubInfo.login &&
                <div>
                  <Avatar
                    src={committerGithubInfo ? (committerGithubInfo.avatar_url || '/user.png') : '/user.png'}
                    className="searchcard__avatar"
                    alt="committer avatar"/>
                  <h4>{committer.name}{
                    committerHasGithubAccount &&
                    <a href={committerGithubInfo.html_url} target="_blank"> @{committerGithubInfo.login}</a>}</h4>
                </div>
              }
            </div>
            <div>
              {commitTime &&
                <p>At {new Date(commitTime).toDateString()}</p>
              }
              <p className="searchcard__message">{entry.commit.message.length > 100 ?
                entry.commit.message.substring(0, 100) + '...':
                entry.commit.message}</p>
              <RaisedButton
                secondary={true}
                href={entry.html_url}
                label={"View Commit on Github"}
                target="_blank"
              />
            </div>
            <div>
              <p className="searchcard__smalltext">(Github's CSP settings rejects displaying iframe, sorry for the inconvenience)</p>
            </div>
          </form>
        </Card>
        <FloatingActionButton
          disabled={repoState.commit >= repoState.total}
          className="searchcard__rightButton"
          onClick={() => browseCommit(repoState.commit + 1)}>
          <NavigationChevronRight />
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
