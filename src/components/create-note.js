import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { setHome } from '../REDUX/actions';
import { connect } from 'react-redux';
import { Button, Collapse } from 'reactstrap';
import Remarkable from 'remarkable';
import Axios from 'axios';

class NewNote extends Component {
  state = {
    title: "",
    content: "",
    requestOptions: { headers: { Authorization: localStorage.getItem('Authorization') } },
    toggleMarkdown: false
  }

  componentDidMount() { this.props.setHome(false) }

  handleSaveNote = () => {
    const { title, content, requestOptions } = this.state;
    Axios
      .post("https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes", { title, content }, requestOptions)
      .then(note => this.props.history.push('/home'))
      .catch(err => console.log('error creating new note'))
    this.setState({ title: "", content: "" });
  }

  getRawMarkup() {
    const md = new Remarkable();
    return {__html: md.render(this.state.content)};
  }

  render() {
    return (
      <div className="PrimaryContainer__newNote">
        <h1 className="PrimaryContainer__header">Create New Note:</h1>
        <div className="d-flex justify-content-between align-items-center">
          <Input 
            type="text"
            className="col-7"
            name="title"
            placeholder="Note Title"
            value={this.state.title}
            onChange={event => this.setState({ [event.target.name]: event.target.value })}
          />
          <div className="d-flex align-items-center justify-content-between">
            <div className="mr-2 text-right">markdown support</div>
            <div className="">
              <div className="onoffswitch">
                <input 
                  onClick={() => this.setState({ toggleMarkdown: !this.state.toggleMarkdown })}
                  type="checkbox" 
                  name="onoffswitch" 
                  className="onoffswitch-checkbox" 
                  id="myonoffswitch"
                  />
                <label className="onoffswitch-label m-0" for="myonoffswitch">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div className="d-flex flex-column">
          <Input 
            type="textarea"
            name="content"
            className="ContentInput"
            placeholder="Note Content"
            value={this.state.content}
            onChange={event => this.setState({ [event.target.name]: event.target.value })}
          />
          <br/>
          <Collapse isOpen={this.state.toggleMarkdown}>
            <div dangerouslySetInnerHTML={this.getRawMarkup()} className="output-text bg-dark text-white ContentInput mb-4"></div>
          </Collapse>
        </div>
        <Button onClick={() => this.handleSaveNote()} className="Button col-3">Save</Button>
      </div>
    )
  }
}

export default connect(null, { setHome })(NewNote);