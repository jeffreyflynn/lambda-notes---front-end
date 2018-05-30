import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setHome } from '../REDUX/actions';
import { Button, Modal, ModalBody } from 'reactstrap';
import TagsInput from 'react-tagsinput';
import { ShowAt, HideAt } from 'react-with-breakpoints';
import Axios from 'axios';

class ViewNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      content: "",
      tags: [],
      id: props.match.params.id,
      requestOptions: { headers: { Authorization: localStorage.getItem('Authorization') } },
      deleteModal: false
    }
  }

  componentDidMount() { 
    this.props.setHome(false);
    const { id, requestOptions } = this.state;
    Axios
      .get(`https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes/${id}`, requestOptions)
      .then(res => {
        const { title, content, tags } = res.data;
        this.setState({ title, content, tags });
      })
      .catch(err => console.log('something went wrong mounting this note'))
  }

  toggleModal = () => { this.setState({ deleteModal: !this.state.deleteModal }) }

  handleNewTag = tags => { this.setState({ tags }) }

  saveTags = () => {
    const { title, content, tags, id, requestOptions } = this.state;
    const updatedNote = { title, content, tags };
    Axios
      .put(`https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes/${id}`, updatedNote, requestOptions)
      .then(res => this.props.history.push('/home'))
      .catch(err => console.log('error saving tags'))
  }

  handleDelete = () => {
    this.toggleModal();
    const { id, requestOptions } = this.state;
    Axios
      .delete(`https://lambdanotes-jeffreyflynn.herokuapp.com/api/notes/${id}`, requestOptions)
      .then(res => this.props.history.push('/home'))
      .catch(err => console.log('error deleting this note'))
  }

  render() {
    const { title, content, id } = this.state;
    return (
      <div className="PrimaryContainer__newNote"> 

        <div className="ViewNote__editOptions">
          <Link to={`/edit/${id}`} className="ViewNote__editOptions--click">edit</Link>
          <button onClick={() => this.toggleModal()} className="ViewNote__editOptions--button">delete</button>
        </div>
        <h1 className="PrimaryContainer__header">{title}</h1>
        <div className="ViewNote__content mb-4">{content}</div>

        <HideAt breakpoint="medium" >
          <div className="d-flex justify-content-between tagEditContainer">
            <TagsInput value={this.state.tags} onChange={this.handleNewTag} />
            <Button onClick={() => this.saveTags()} className="Nav__ButtonsContainer--navButton col-1 my-0">Save Tags</Button>
          </div>
        </HideAt>
        <ShowAt breakpoint="medium">
          <div className="d-flex flex-column">
            <TagsInput value={this.state.tags} onChange={this.handleNewTag} />
            <Button onClick={() => this.saveTags()} className="Nav__ButtonsContainer--navButton col-3 my-3 tagButton">Save Tags</Button>
          </div>
        </ShowAt>

        {this.state.deleteModal ? (
          <Modal isOpen={this.state.deleteModal} className="deleteModal">
            <ModalBody className="Modal__header">Are you sure you want to delete this?</ModalBody>
            <div className="Modal__ButtonsContainer">
              <Button onClick={() => this.handleDelete()} color="danger" className="Modal__button--reg">Delete</Button>
              <Button color="primary" onClick={() => this.toggleModal()} className="Modal__button--reg">No</Button>
            </div>
          </Modal>
        ) : null}

      </div>
    )
  }
}
const mapStateToProps = state => ({ notes: state.notes });
export default connect(mapStateToProps, { setHome })(ViewNote);
