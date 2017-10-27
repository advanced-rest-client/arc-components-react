import React from 'react';

export default class ApiRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUrl: undefined,
      baseUri: undefined
    };

    this.onResponseReady = this.onResponseReady.bind(this);
  }
  componentDidMount() {
    this.requestPanel.addEventListener('api-console-response-ready', this.onResponseReady);

    if (!this.state.redirectUrl) {
      this.updateRedirectUrl(this.props.bowerLocation);
    }
  }

  componentDidUpdate(prevProps) {
    const {bowerLocation, selectedObject, baseUri} = this.props;
    if (prevProps.bowerLocation !== bowerLocation) {
      this.updateRedirectUrl(bowerLocation);
    }
    this.updateSelectedObject(selectedObject);
    this.updateBaseUri(baseUri);
  }

  componentWillUnmount() {
    this.requestPanel.removeEventListener('api-console-response-ready', this.onResponseReady);
  }

  updateSelectedObject(selectedObject) {
    this.requestPanel.method = selectedObject;
  }

  onResponseReady(e) {
    var data = e.detail;
    this.responsePanel.request = data.request;
    this.responsePanel.response = data.response;
    this.responsePanel.responseError = data.responseError;
    this.responsePanel.isXhr = data.isXhr;
    this.responsePanel.loadingTime = data.loadingTime;
    this.responsePanel.redirects = data.redirects;
    this.responsePanel.redirectTimings = data.redirectTimings;
    this.responsePanel.responseTimings = data.timings;
    this.responsePanel.sentHttpMessage = data.sourceMessage;
  }

  updateRedirectUrl(location) {
    var a = document.createElement('a');
    if (!location) {
      location = 'bower_components/';
    }
    if (location && location[location.length - 1] !== '/') {
      location += '/';
    }
    a.href = location + 'oauth-authorization/oauth-popup.html';
    this.setState({redirectUrl: a.href});
  }

  updateBaseUri(baseUri) {
    if (!this.state || this.state.baseUri !== baseUri) {
      this.setState({baseUri: baseUri});
    }
  }

  render() {
    return (
      <div>
        <raml-request-panel ref={(requestPanel) => { this.requestPanel = requestPanel; }} redirect-url={this.state.redirectUrl} base-uri={this.state.baseUri}/>
        <response-view ref={(responsePanel) => { this.responsePanel = responsePanel; }} />
      </div>
    );
  }
}
