import React, { Component } from 'react';
import { Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { setHome } from '../REDUX/actions';
import { connect } from 'react-redux';
import Axios from 'axios';

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      tags: [],
      id: props.match.params.id,
      requestOptions: { headers: { Authorization: localStorage.getItem('Authorization') } }
    };
  }

  componentDidMount() { 
    this.props.setHome(false) 
    const { id, requestOptions } = this.state;
    Axios
      .get(`https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes/${id}`, requestOptions)
      .then(res => {
        const { title, content, tags } = res.data;
        this.setState({ title, content, tags })
      })
      .catch(err => console.log('error mounting note'))
  }

  updateNote = () => {
    const { title, content, tags, id } = this.state;
    const token = localStorage.getItem('Authorization')
    const requestOptions = { headers: { Authorization: token } }
    Axios
      .put(`https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes/${id}`, { title, content, tags }, requestOptions)
      .then(res => this.props.history.push('/home'))
      .catch(err => console.log('error updating note'))
  }

  render() {
    return (
      <div className="PrimaryContainer__newNote">
        <h1 className="PrimaryContainer__header">Edit Note:</h1>
        <Input 
          type="text"
          name="title"
          className="col-7"
          placeholder="Note Title"
          value={this.state.title}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
        />
        <br/>
        <Input 
          className="ContentInput"
          type="textarea"
          name="content"
          placeholder="Note Content"
          value={this.state.content}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
        />
        <br/>
        <Button onClick={() => this.updateNote()} className="Button col-3">Update</Button>
      </div>
    )
  }
}

export default connect(null, { setHome })(EditNote);