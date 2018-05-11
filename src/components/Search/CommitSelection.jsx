import React, { Component } from 'react';

class CommitSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: this.props.repoState.owner || '',
      repo: this.props.repoState.repo || '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    
  }

  render() {
    return (
      <div>
        <form action="">

        </form>
      </div>
    )
  }
}

export default CommitSelection;