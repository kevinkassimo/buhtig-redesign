import React, { Component } from 'react';
import { connect } from 'react-redux';
import Search from '../components/Search/Search';
import { actions } from '../redux';

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
    getCurrentCommit: (commit) => dispatch(actions.getCurrentCommit(commit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
