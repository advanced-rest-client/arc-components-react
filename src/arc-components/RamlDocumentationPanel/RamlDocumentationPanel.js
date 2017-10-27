import React from 'react';

export default class RamlDocumentationPanel extends React.Component {

  constructor(props) {
    super(props);
    this.onRamlPathChanged = this.onRamlPathChanged.bind(this);
  }

  componentDidMount() {
    this.panel.addEventListener('raml-path-changed', this.onRamlPathChanged);
    this.updateRamlDocumentationPanel();
  }

  componentDidUpdate() {
    this.updateRamlDocumentationPanel();
  }

  componentWillUnmount() {
    this.panel.removeEventListener('raml-path-changed', this.onRamlPathChanged);
  }

  onRamlPathChanged(e) {
    if (this.props.onPathChanged) {
      this.props.onPathChanged(e.detail.path);
    }
  }

  updateRamlDocumentationPanel() {
    const {selectedPath, selectedObject, selectedParent} = this.props;
    this.panel.path = selectedPath;
    this.panel.selectedObject = selectedObject;
    this.panel.selectedParent = selectedParent;
  }

  render() {
    return (
      <div>
        <raml-documentation-panel ref={(panel) => { this.panel = panel; }}/>
      </div>
    );
  }
}
