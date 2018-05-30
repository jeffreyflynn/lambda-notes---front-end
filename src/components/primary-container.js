import React, { Component } from 'react';
import { 
  Card, CardTitle, CardBody, CardFooter,
  CardText, Col, Dropdown, 
  DropdownToggle, DropdownMenu, DropdownItem 
} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotes, handleReverse, handleOrder, sortTitle, setHome } from '../REDUX/actions';
import Dragula from 'dragula';
import TagsInput from 'react-tagsinput';
import axios from 'axios';

class PrimaryContainer extends Component {
  constructor() {
    super();
    this.state = { 
      activeUser: "",
      listView: false,
      listOptions: false,
      sortOptions: false,
      defaultSort: true,
      sortOldest: false,
      sortTitle: false,
      letsDrag: false
    }
  }

  componentDidMount() { 
    this.props.setHome(true)
    const token = localStorage.getItem('Authorization')
    const requestOptions = { headers: { Authorization: token } }
    this.props.getNotes(requestOptions)
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      Dragula([componentBackingInstance], {
        getImmediateChild: (dropT, t) => {console.log(dropT)}
      })
    }
  }

  cardFactory = note => {
    const contentLength = note.content.split(" ");
    return (
      <Col 
        md="12" 
        lg={this.props.listView ? "12" : "6"} 
        xl={this.props.listView ? "12" : "4"} 
        className="NoteCard" 
        key={note._id}
      >
        <Card className="Card">
          <Link to={{ pathname: `/viewnote/${note._id}`, state: { viewNote: {note} } }} className="CardLink">
            <CardBody className="CardContent">
              <CardTitle className="CardTitle">{note.title}</CardTitle>
              <CardText className="CardText">
                { contentLength.length >= 17 ? `${contentLength.slice(0, 17).join(" ")} ...` : note.content }
              </CardText>
            </CardBody>
          </Link>
          {note.tags && note.tags.length > 0 ? (
            <CardFooter>
              <TagsInput 
                value={note.tags} onChange={this.handleNewTag} 
                disabled className="text-truncate primary-input" 
                inputProps={{placeholder: ""}}
                />
            </CardFooter>
          ) : (null)}
          
        </Card>
      </Col>
    )
  }

  viewOrder = () => {
    return (
      <Dropdown group 
        isOpen={this.state.sortView} 
        size="sm" 
        className="mr-3"
        toggle={() => this.setState({ sortView: !this.state.sortView })}>
        <DropdownToggle caret className="Nav__ButtonsContainer--navButton">Sort by</DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() => {
              this.setState({ defaultSort: false, sortOldest: false, sortTitle: true, letsDrag: false })
              this.props.sortTitle();
            }}
            className={!this.state.defaultSort && !this.state.sortOldest && !this.state.letsDrag ? "active" : ""}
          >Title A-Z</DropdownItem>
          <DropdownItem 
            onClick={() => {
              this.setState({ defaultSort: false, sortOldest: true, sortTitle: false, letsDrag: false });
              this.props.handleReverse();
            }}
            className={!this.state.defaultSort && !this.state.sortTitle && !this.state.letsDrag ? "active" : ""}  
          >Oldest - Newest</DropdownItem>
          <DropdownItem 
            onClick={() => {
              this.setState({ defaultSort: true, sortOldest: false, sortTitle: false, letsDrag: false });
              this.props.handleOrder();
            }}
            className={!this.state.sortTitle && !this.state.sortOldest && !this.state.letsDrag ? "active" : ""}
          >Newest - Oldest</DropdownItem>
          <DropdownItem
            onClick={() => this.setState({ letsDrag: true, defaultSort: false, sortOldest: false, sortTitle: false })}
            className={this.state.letsDrag ? "active" : ""}
          >Drag</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  render() {
    return (
      <div className="PrimaryContainer">

        <div className="d-flex justify-content-between align-items-center w-100 sticks">
          <h1 className="PrimaryContainer__header--notecards sticky">
            {this.props.username !== "" ? `${this.props.username}'s Notes:` : "Your Notes:"}
          </h1>
          <div className="sticky">{ this.viewOrder() }</div>
        </div>

        <div className="PrimaryContainer__cardContainer mx-0" ref={this.state.letsDrag ? this.dragulaDecorator : null}>
          {this.props.notes.map(note => this.cardFactory(note))}
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({ 
  notes: state.notes, 
  night: state.night, 
  listView: state.listView,
  username: state.username,
  isHome: state.isHome
})

export default connect(mapStateToProps, { 
  getNotes, 
  handleReverse, 
  handleOrder, 
  sortTitle ,
  setHome
})(PrimaryContainer);