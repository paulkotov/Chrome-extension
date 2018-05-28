import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TextElement from './TextElement';
import { SHOW_ALL, SHOW_NAME } from '../constants/Filters';
import './FilterPanel.css';

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_NAME]: 'Name'
};

export default class Footer extends Component {
  static propTypes = {
    count: PropTypes.number,
    filter: PropTypes.string.isRequired,
    onShow: PropTypes.func.isRequired
  }

  renderCount() {
    const { count } = this.props;
    const itemWord = count === 1 ? 'record' : 'records';

    return (
      <span className="pokemons-count">
        <strong>{count || 'No'}</strong> {itemWord} matches
      </span>
    );
  }

  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter];
    const { filter: selectedFilter, onShow } = this.props;

    return (
      <a className={classnames({ selected: filter === selectedFilter })}
         style={{ cursor: 'pointer' }}
         onClick={() => onShow(filter)}>
        {title}
      </a>
    );
  }

  onFieldChange = (fieldName, e) => {
    if (e.target.value.trim().length > 0) {
      this.setState({ [''+fieldName]: e.target.value.trim() });
    }
  }

  onBtnClickHandler = e => {
    e.preventDefault();
    const { onShow } = this.props;
    onShow(this.FilterInput.state.text);
  }

  render() {
    return (
     <footer className="footer">
        Filter by name:
        <TextElement type="text"
                ref={input => this.FilterInput = input}
                onChange={this.onFieldChange.bind(this, 'FilterIsEmpty')}
                placeholder="Enter name" />{' '}
        <button className="Set Filter btn btn-default"
                      onClick={this.onBtnClickHandler}> Filter </button>
        <br/>
        Filter by group: <input className="toggle"
                  type="checkbox"/><br/>
        {this.renderCount()}
      </footer>
    );
  }
}