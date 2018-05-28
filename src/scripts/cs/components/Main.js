import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import { Table } from 'react-bootstrap';
import FilterPanel from './FilterPanel';

export default class Main extends Component {
  static propTypes = {
    info: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      fullInfo: false,
      filter: 'SHOW_ALL',
      name: ''

    };
  }

  handleShow = filter => {
    this.setState({
      filter: 'NAME',
      name: filter });
  }

  renderToggleAll(completedCount) {
    const { info, actions } = this.props;
    if (info.length > 0) {
      return (
        <input className="toggle-all"
               type="checkbox"
               checked={completedCount === info.length}
               onChange={actions.completeAll} />
      );
    }
  }

  resetFilter = () => {
    this.setState({
      filter: 'SHOW_ALL',
      name: ''
    });
  }

  renderFooter(count) {
    const { info } = this.props;
    const { filter } = this.state;

    if (info.length) {
      return (
        <FilterPanel filter={filter}
                onShow={this.handleShow}
                count={count} />
      );
    } else {
      return (
        <div>
          <hr/>
          No records in DB
        </div>
      );
    }
  }
  renderTableItems() {

  }

  render() {
    const { info, actions } = this.props;
    const count = info.length;
    const filtered = info.filter(elem => {
      switch(this.state.filter) {
        case 'NAME':
          return (elem.name === this.state.name) ? true : false;

        default:
          return true;
      }
    });

    return (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item =>
                <Item key={item.id} info={item} {...actions}/>
              )}
          </tbody>
        </Table>
        {this.renderFooter(count)}
          <button className="btn btn-default" onClick={this.AddNew}> + </button>
      </div>
    );
  }
}
