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
    submitCommit: (commit) => dispatch(actions.submitCommit(commit)),
    getNextCommit: () => dispatch(actions.getNextCommit()),
    getPrevCommit: () => dispatch(actions.getPrevCommit()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
