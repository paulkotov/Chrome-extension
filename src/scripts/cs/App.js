import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Main from './components/Main';
import * as Actions from './actions';

const style = {
  border: 2+'px',
  display: 'block',
  width: 700+'px',
  height: 500+'px'
};

const App = ({ info, actions }) => (
  <div className="fast_actions" style={style}>
  <h2>Быстрые свойства</h2>
    <Main info={info} actions={actions} />
  </div>
);

App.propTypes = {
  info: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  info: state.data
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
