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
import SearchInput, { createFilter } from 'react-search-input';
import InfiniteScroll from 'react-infinite-scroller';
import FaSearch from 'react-icons/lib/fa/search'
import axios from 'axios';
import glamorous from 'glamorous';

const MainOptions = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

const SearchBar = glamorous.input({
  margin: 'auth 1%',
  borderRadius: '3px',
  backgroundColor: 'rgba(42, 192, 197, 0.15)',
  // backgroundColor: 'rgb(215, 215, 215, 0.1)',
  border: 'none',
  padding: '2%',
  boxShadow: '1px 1px #D7D7D7'
})

class PrimaryContainer extends Component {
  constructor() {
    super();
    this.state = { 
      search: "",
      activeUser: "",
      listView: false,
      listOptions: false,
      sortOptions: false,
      defaultSort: true,
      sortOldest: false,
      sortTitle: false,
      letsDrag: false,
      searchActive: false,
    }
  }

  componentDidMount() { 
    this.props.setHome(true)
    const token = localStorage.getItem('Authorization')
    const requestOptions = { headers: { Authorization: token } }
    this.props.getNotes(requestOptions)
    this.setState({ activeNotes: this.props.notes.slice(0, 9) })
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
    const searchResults = this.props.notes.filter(note => note.title.includes(this.state.search))
    return (
      <div className="PrimaryContainer">

        <div className="d-flex justify-content-between align-items-center w-100 sticks">
          <h1 className="PrimaryContainer__header--notecards sticky">
            {this.props.username !== "" ? `${this.props.username}'s Notes:` : "Your Notes:"}
          </h1>
          <MainOptions>
            {this.state.searchActive ? (
              <SearchBar 
                name="search"
                placeholder="Search..."
                value={this.state.search}
                onChange={e => this.setState({ [e.target.name]: e.target.value })}
              />
            ): null}
            <FaSearch 
              className="mr-4 ml-1 icon"
              onClick={() => this.setState({ searchActive: !this.state.searchActive })}
              />
            <div className="sticky">{ this.viewOrder() }</div>
          </MainOptions>
        </div>

        <div className="PrimaryContainer__cardContainer mx-0" ref={this.state.letsDrag ? this.dragulaDecorator : null}>
          {searchResults.map(note => this.cardFactory(note))}
        </div>

        {/* <div className="PrimaryContainer__cardContainer mx-0" ref={this.state.letsDrag ? this.dragulaDecorator : null}>
          {this.props.notes.map(note => this.cardFactory(note))}
        </div> */}

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