function validateMatricNum (id) {
  if (!id) {
    return;
  }

  var matches = id.toUpperCase().match(/^A\d{7}|U\d{6,7}/);
  if (matches) {
    var match = matches[0];

    // Discard 3rd digit from U-prefixed NUSNET ID
    if (match[0] === 'U' && match.length === 8) {
      match = match.slice(0, 3) + match.slice(4);
    }

    var weights = {
      U: [0, 1, 3, 1, 2, 7],
      A: [1, 1, 1, 1, 1, 1]
    }[match[0]];

    for (var i = 0, sum = 0, digits = match.slice(-6); i < 6; i++) {
      sum += weights[i] * digits[i];
    }

    return id === (match + 'YXWURNMLJHEAB' [sum % 13]);
  }
}

function validateConfessionId (id) {
  if (!id) {
    return false;
  }

  var number = parseFloat(id);

  if (!Number.isInteger(number) || number <= 0 || number >= 50000) {
    return false;
  }

  return true;
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matricNum: '',
      confessionId: '',
      tnc: false,
      rickrolled: false
    };
  }

  onInputChange(field, event) {
    this.setState({
      [field]: field === 'tnc' ? event.target.checked : event.target.value
    });
  }

  isFormValid() {
    return validateMatricNum(this.state.matricNum) &&
      validateConfessionId(this.state.confessionId) &&
      this.state.tnc;
  }

  tncLink(event) {
    event.preventDefault();
    window.open('https://www.wikiwand.com/en/April_Fools\'_Day');
  }

  onSubmitClick() {
    this.setState({
      loading: true,
      rickrolled: true
    });
    ga('send', 'event', 'rickroll', this.state.confessionId, this.state.matricNum);
    setTimeout(() => {
      this.setState({
        loading: false
      });
      swal({
        title: 'Happy April Fools\' Day!',
        text: '<p>Just kidding, we don\'t track users information (or do we?)</p> \
          <p>Spread the love and share the joke!</p><br/> \
          <iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameBorder="0" autoPlay allowFullScreen></iframe>',
        confirmButtonText: 'Sigh, I\'m so naive...',
        html: true
      });
    }, 1500);
  }

  render() {
    return (
      <div>
        <p className="blurb">Free for a limited time, you can uncover the identity of the OPs of your favourite NUSWhispers confessions.</p>
        <p className="blurb">Simply enter your matric number and the desired confession number, and the details of the confession's OP will be sent to your NUS email. Limited to <strong>3 uses per matric number per day!</strong></p>
        <br/>
        <div className="form-horizontal">
          <div
            className={`form-group
              ${validateMatricNum(this.state.matricNum) ? 'has-success' : ''}
              ${!validateMatricNum(this.state.matricNum) && this.state.matricNum.length !== 0 ? 'has-error' : ''}`}>
            <div className="col-sm-12">
              <input
                type="text"
                className="form-control input-lg"
                id="nusnet-id"
                onChange={this.onInputChange.bind(this, 'matricNum')}
                value={this.state.matricNum}
                disabled={this.state.rickrolled}
                placeholder="Matric No, e.g. A1234567Z"/>
            </div>
          </div>
          <div
            className={`form-group
              ${validateConfessionId(this.state.confessionId) ? 'has-success' : ''}
              ${!validateConfessionId(this.state.confessionId) && this.state.confessionId.length !== 0 ? 'has-error' : ''}`}>
            <div className="col-sm-12">
              <input
                type="number"
                className="form-control input-lg"
                id="confession-id"
                onChange={this.onInputChange.bind(this, 'confessionId')}
                value={this.state.confessionId}
                disabled={this.state.rickrolled}
                placeholder="Confession Number, e.g. 401"/>
            </div>
          </div>
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                onChange={this.onInputChange.bind(this, 'tnc')}
                disabled={this.state.rickrolled}
                checked={this.state.checked}/> I agree to the terms and conditions
            </label>
          </div>
          <br/>
          <button type="submit"
            className="btn btn-lg btn-block btn-primary"
            disabled={!this.isFormValid() || this.state.rickrolled}
            onClick={this.onSubmitClick.bind(this)}>
            {this.state.loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'))
