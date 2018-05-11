import React, { Component } from 'react';
import { connect } from 'react-redux';
import Search from '../components/Search/Search';
import { getNextCommit, getPrevCommit, submitCommit, submitRepo } from '../redux/repo/index';

const mapStateToProps = (state) => {
  return {
    repoState: state.repo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitRepo: (owner, repo) => dispatch(submitRepo(owner, repo)),
    submitCommit: (commit) => dispatch(submitCommit(commit)),
    getNextCommit: () => dispatch(getNextCommit()),
    getPrevCommit: () => dispatch(getPrevCommit()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
