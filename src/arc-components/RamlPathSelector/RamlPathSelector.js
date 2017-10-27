import React from 'react';

export default class RamlPathSelector extends React.Component {

  constructor(props) {
    super(props);
    this.pathChanged = this.pathChanged.bind(this);
    this.selectedObjectChanged = this.selectedObjectChanged.bind(this);
    this.selectedParentChanged = this.selectedParentChanged.bind(this);
  }

  componentDidMount() {
    this.selector.addEventListener('raml-selected-path-changed', this.pathChanged);
    this.r2o.addEventListener('selected-object-changed', this.selectedObjectChanged);
    this.r2o.addEventListener('selected-parent-changed', this.selectedParentChanged);
    if (this.props.raml) {
      this.updateRaml();
    }
  }

  componentWillUnmount() {
    this.selector.removeEventListener('raml-selected-path-changed', this.pathChanged);
    this.r2o.removeEventListener('selected-object-changed', this.selectedObjectChanged);
    this.r2o.removeEventListener('selected-parent-changed', this.selectedParentChanged);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.narrow !== this.props.narrow) {
      this.selector.narrow = this.props.narrow;
    }
    const {selectedPath, raml} = this.props;
    if (prevProps.raml !== raml) {
      this.updateRaml();
      return;
    }
    if (prevProps.selectedPath !== selectedPath) {
      this.selector.selectedPath = selectedPath;
    }
  }

  pathChanged(event) {
    this.r2o.selectedPath = event.detail.path;
    const {onPathChanged, selectedPath} = this.props;
    if (onPathChanged && event.detail.path !== selectedPath) {
      onPathChanged(event.detail.path);
    }
  }

  updateRaml() {
    const {selectedPath, raml} = this.props;
    if (this.selector.raml !== raml) {
      this.selector.raml = raml;
      this.r2o.raml = raml;
    }
    // `undefined` does not trigger change
    this.selector.selectedPath = selectedPath || undefined;
    this.r2o.selectedPath = this.selector.selectedPath;
  }

  selectedObjectChanged(event) {
    if (this.props.onSelectedObject) {
      this.props.onSelectedObject(event.detail.value);
    }
  }

  selectedParentChanged(event) {
    if (this.props.onSelectedParent) {
      this.props.onSelectedParent(event.detail.value);
    }
  }

  render() {
    return (
      <div>
        <raml-path-selector
          first-level-opened
          resources-opened
          documentation-opened
          noink
          ref={(selector) => { this.selector = selector; }}
        />
        <raml-path-to-object ref={(r2o) => { this.r2o = r2o; }}></raml-path-to-object>
      </div>
    );
  }
}
