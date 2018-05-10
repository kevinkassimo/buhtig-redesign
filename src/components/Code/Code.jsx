import React, {Component} from 'react';

class Code extends Component {
  constructor(props) {
    super(props);

    this.state = {
      json: null,
    };
  }

  componentDidMount () {
    fetch(`http://localhost:8000/account/auth_code?code=${this.props.code}`, {
        credentials: process.env.NODE_ENV !== 'production' ? 'include' : 'same-origin',
      })
      .then(res => {
        return res.text()
      })
      .then(json => {
        this.setState({
          json,
        });
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    return (
      <pre>
        {this.state.json}
      </pre>
    )
  }
}

export default Code;