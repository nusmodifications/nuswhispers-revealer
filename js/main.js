function validateNUSNetId (id) {
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
      nusnetId: '',
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
    return validateNUSNetId(this.state.nusnetId) &&
      validateConfessionId(this.state.confessionId) &&
      this.state.tnc;
  }

  tncLink(event) {
    event.preventDefault();
    window.open('https://www.wikiwand.com/en/April_Fools\'_Day');
  }

  onSubmitClick() {
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        rickrolled: true
      });
    }, 1500);
  }

  render() {
    return (
      <div>
        {this.state.rickrolled ?
          <div className="text-center">
            <h3>Happy April Fool's Day!</h3>
            <p>Just kidding, we don't track users information (or do we?)</p>
            <p>Share the love (and the joke)!</p>
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" autoplay allowfullscreen></iframe>
          </div>
          :
          <div>
            <p class="blurb">For a limited time, NUSWhispers will be revealing the identity of the OPs of your favourite confessions.</p>
            <p class="blurb">Simply enter your NUSNET ID and the desired confession number and the details of the OP of the confession will be sent to your NUS email. Limited to <strong>3 uses per NUSNET ID!</strong></p>
            <br/>
            <div className="form-horizontal">
              <div
                className={`form-group
                  ${validateNUSNetId(this.state.nusnetId) ? 'has-success' : ''}
                  ${!validateNUSNetId(this.state.nusnetId) && this.state.nusnetId.length !== 0 ? 'has-error' : ''}`}>
                <div className="col-sm-12">
                  <input
                    type="text"
                    className="form-control input-lg"
                    id="nusnet-id"
                    onChange={this.onInputChange.bind(this, 'nusnetId')}
                    value={this.state.nusnetId}
                    placeholder="NUSNET ID, e.g. A0132164"/>
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
                    placeholder="Confession Number, e.g. 401"/>
                </div>
              </div>
              <div className="checkbox">
                <label>
                  <input type="checkbox" onChange={this.onInputChange.bind(this, 'tnc')} checked={this.state.checked}/> I agree to the <a target="_blank" onClick={this.tncLink.bind(this)}>terms and conditions</a>.
                </label>
              </div>
              <br/>
              <button type="submit"
                className="btn btn-lg btn-block btn-primary"
                // disabled={!this.isFormValid()}
                onClick={this.onSubmitClick.bind(this)}>
                {this.state.loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        }
      </div>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'))
