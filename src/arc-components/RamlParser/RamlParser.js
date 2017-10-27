import React from 'react';

export default class RamlParser extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      url: null
    };

    this.parserDataReady = this.parserDataReady.bind(this);
    this.parserError = this.parserError.bind(this);
    this.enhancerDataReady = this.enhancerDataReady.bind(this);
  }

  componentDidMount() {
    this.ramlParser.addEventListener('api-parse-ready', this.parserDataReady);
    this.ramlParser.addEventListener('error', this.parserError);

    this.ramlEnhancer.addEventListener('raml-json-enhance-ready', this.enhancerDataReady);
    this.ramlEnhancer.addEventListener('error', this.parserError);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.url || this.props.url === nextProps.url) {
      return;
    }
    this.ramlParser.loadApi(nextProps.url);
  }

  componentWillUnmount() {
    this.ramlParser.removeEventListener('api-parse-ready', this.parserDataReady);
    this.ramlParser.removeEventListener('error', this.parserError);

    this.ramlEnhancer.removeEventListener('raml-json-enhance-ready', this.enhancerDataReady);
    this.ramlEnhancer.removeEventListener('error', this.parserError);
  }

  parserDataReady(e) {
    // Previously raml prop was used instead of json
    this.ramlEnhancer.json = e.detail.json;
  }

  enhancerDataReady(e) {
    this.props.onData(e.detail.json);
    this.ramlEnhancer.raml = undefined;
  }

  parserError() {
    const message = 'Unable to parse RAML data';

    this.props.onError(message);
  }

  render() {
    return (
      <div>
        <raml-js-parser
          json
          ref={(parser) => { this.ramlParser = parser; }}
        />
        <raml-json-enhance
          ref={(enhancer) => { this.ramlEnhancer = enhancer; }}
        />
      </div>
    );
  }
}
