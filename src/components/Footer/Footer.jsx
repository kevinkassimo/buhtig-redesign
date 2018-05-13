import React, { Component } from 'react';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="footer">
        <span className="footer__left">Built & Rebuilt <a href="https://github.com/kevinkassimo">@kevinkassimo</a></span>
        <span className="footer__right"><a href="https://github.com/kevinkassimo/buhtig-redesign">Visit Github Repo</a></span>
      </div>
    );
  }
}

export default Footer;