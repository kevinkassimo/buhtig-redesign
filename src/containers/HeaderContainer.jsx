import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header/Header'

const mapStateToProps = (state) => {
  console.log(state.user.avatar);
  return {
    avatar: state.user.avatar || null,
  };
};

export default connect(mapStateToProps)(Header)