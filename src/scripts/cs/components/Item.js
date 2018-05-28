import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import 'antd/lib/button/style/index.css';
import TextElement from './TextElement';

export default class Item extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    editData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    fullInfo: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      phone: '',
      email: '',
      memo: '',
      fullInfo: false,
      editing: false
    };
  }

  onFieldChange = (fieldName, e) => {
    if (e.target.value.trim().length > 0) {
      this.setState({ [''+fieldName]: e.target.value.trim() });
    } else {
      this.setState({ [''+fieldName]: '' });
    }
  }

  onSaveHandler = Id => e => {
    e.preventDefault();
    this.setState({ id: Id });
    const name = this.NameInput.state.text;
    const phone = this.PhoneInput.state.text;
    const email = this.EmailInput.state.text;
    const memo = this.MemoInput.state.text;
    const data= {
      id: this.props.info.id,
      name: name,
      phone: phone,
      email: email,
      memo: memo
    };
    this.props.editData(data);
    this.setState({ editing: false });
  }

  editInfo = event => {
    this.setState({
      editing: true
    });
    event.preventDefault();
  }

  showInfo() {
    const { info, deleteData } = this.props;
    const style = {
      cursor: 'pointer',
      color: 'blue'
    };
    { if(this.state.fullInfo) {
      return (
        <td colSpan="3" className="view">
           <span className="Main"> Name: {info.name}, Phone: {info.phone}, Email: {info.email}, Memo: {info.memo}{' '}
              <span onClick={() => this.setState({ editing: true }) } className="link" style={style}>Изменить</span>|<span onClick={() => deleteData(info.id)} className="link" style={style}>Удалить</span>
           </span>
        </td>);
    }
      return (
      <td colSpan="3" className="view">
        <span>{info.name}</span>
      </td>);
    }
  }

  editPanelRender() {
    const { info } = this.props;
    return(
      <td colSpan="3" className="editing">
        Name: <TextElement text={info.name}
                      ref={input => this.NameInput = input}
                      editing={this.state.editing}
                      onChange={this.onFieldChange.bind(this, 'NameIsEmpty')}
        /><br/>
        Phone: <TextElement text={info.phone}
                      ref={input => this.PhoneInput = input}
                      editing={this.state.editing}
                      onChange={this.onFieldChange.bind(this, 'PhoneIsEmpty')}
        /><br/>
        Email: <TextElement text={info.email}
                      ref={input => this.EmailInput = input}
                      editing={this.state.editing}
                      onChange={this.onFieldChange.bind(this, 'EmailIsEmpty')}
        /><br/>
        Memo: <TextElement text={info.memo}
                      ref={input => this.MemoInput = input}
                      editing={this.state.editing}
                      onChange={this.onFieldChange.bind(this, 'MemoIsEmpty')}
        /><br/>
        <Button type="primary" onClick={this.onSaveHandler(info.id)} > Save </Button>
      </td>
    );
  }

  render() {
    return (
      <tr>
        <td>
          <Button onClick={()=>{
this.setState({ fullInfo: !this.state.fullInfo });
} }>+</Button>
        </td>
        {this.state.editing ? this.editPanelRender() : this.showInfo()}
      </tr>
    );
  }
}