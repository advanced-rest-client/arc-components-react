import React, { Component } from 'react';
import './App.css';
import RamlParser from './arc-components/RamlParser';
import RamlPathSelector from './arc-components/RamlPathSelector';
import RamlDocumentationPanel from './arc-components/RamlDocumentationPanel';
import ApiRequest from './arc-components/ApiRequest';

class App extends Component {

  constructor(props) {
    super(props);
    // In Polymer 1.0 `undefined` does not triggers change
    this.state = {
      url: null,
      raml: undefined,
      selectedPath: undefined,
      selectedObject: undefined,
      selectedParent: undefined,
      navNarrow: false,
      page: 'docs'
    };

    this.urlRequested = this.urlRequested.bind(this);
    this.onRamlData = this.onRamlData.bind(this);
    this.onRamlPathChanged = this.onRamlPathChanged.bind(this);
    this.onSelectedObject = this.onSelectedObject.bind(this);
    this.onSelectedParent = this.onSelectedParent.bind(this);
    this.onTryItRequested = this.onTryItRequested.bind(this);
    this.pathChangedEventHandler = this.pathChangedEventHandler.bind(this);
    this.baseUriChange = this.baseUriChange.bind(this);
  }

  componentDidMount() {
    this.urlButton.addEventListener('click', this.urlRequested);
    this.appContainer.addEventListener('raml-path-changed', this.onRamlPathChanged);
    this.appContainer.addEventListener('tryit-requested', this.onTryItRequested);
    this.appContainer.addEventListener('raml-selected-path-changed', this.pathChangedEventHandler);
  }

  componentWillUnmount() {
    this.urlButton.removeEventListener('click', this.urlRequested);
    this.appContainer.removeEventListener('raml-path-changed', this.onRamlPathChanged);
    this.appContainer.removeEventListener('tryit-requested', this.onTryItRequested);
    this.appContainer.removeEventListener('raml-selected-path-changed',
      this.pathChangedEventHandler);
  }

  urlRequested() {
    this.setState({
      url: this.urlInput.value
    });
  }

  onRamlData(raml) {
    this.setState({
      raml: raml
    });
  }

  onRamlPathChanged(path) {
    this.setState({
      selectedPath: path
    });
    // console.log('Path', path);
  }

  onSelectedObject(obj) {
    this.setState({
      selectedObject: obj
    });
    // console.log('Selected object', obj);
  }

  onSelectedParent(obj) {
    this.setState({
      selectedParent: obj
    });
    // console.log('Selected parent', obj);
  }

  onTryItRequested() {
    this.setState({
      page: 'request'
    });
  }

  pathChangedEventHandler() {
    if (!this.sate || this.sate.page !== 'docs') {
      this.setState({
        page: 'docs'
      });
    }
  }

  baseUriChange(e) {
    this.setState({
      baseUri: e.target.value
    });
  }

  render() {
    const hasRaml = !!this.state.raml;
    const hasSelectedPath = this.state.selectedPath;
    const page = this.state.page;

    let selector;
    if (hasRaml) {
      selector = <RamlPathSelector raml={this.state.raml} selectedPath={this.state.selectedPath} narrow={this.state.navNarrow} onPathChanged={this.onRamlPathChanged} onSelectedObject={this.onSelectedObject} onSelectedParent={this.onSelectedParent}/>
    } else {
      selector = null;
    }

    let mainSection;
    if (!hasRaml) {
      mainSection = <p>Load RAML file to see how it works</p>;
    } else if (!hasSelectedPath) {
      mainSection = <p>Documentation is not selected by default. Application can do it automatically on patch change. Select a documentation content.</p>;
    } else {
      if (page === 'docs') {
        mainSection = <RamlDocumentationPanel selectedPath={this.state.selectedPath} selectedObject={this.state.selectedObject} selectedParent={this.state.selectedParent} />;
      } else {
        mainSection = <ApiRequest selectedObject={this.state.selectedObject} baseUri={this.state.baseUri}/>
      }
    }
    //https://cdn.rawgit.com/advanced-rest-client/raml-example-api/42cad8c7/api.raml
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">ARC elements with React</h1>
          <div className="raml-url">
            <input type="url" placeholder="RAML url" ref={(urlInput) => { this.urlInput = urlInput; }} defaultValue="https://cdn.rawgit.com/advanced-rest-client/echo-advancedrestclient-com/c33390e6/api/api.raml" />
            <button ref={(urlButton) => { this.urlButton = urlButton; }}>Get RAML</button>
          </div>

          <div className="env-selector">
            <label>Manually change base URI</label>
            <select onChange={this.baseUriChange}>
              <option value="">RAML base uri</option>
              <option value="http://api.domain.com/endpoint/path">Production</option>
              <option value="http://stage.domain.com/test/api">Staging</option>
              <option value="http://devx.domain.com/test/api">Development</option>
            </select>
          </div>

        </header>
        <div className="AppContainer" ref={(appContainer) => { this.appContainer = appContainer; }}>
          <div className="AppSide">
            {selector}
          </div>
          <div className="Content">
            {mainSection}
          </div>
        </div>
        <RamlParser ref={(ramlParser) => { this.ramlParser = ramlParser; }} url={this.state.url} onData={this.onRamlData} />
      </div>
    );
  }
}

export default App;
