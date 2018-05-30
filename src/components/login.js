import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap'; // Input, Button
import { headShake } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import glamorous from 'glamorous';

const Container = glamorous.div({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '25%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  zIndex: 333
});

const Input = glamorous.input({
  margin: 'auto',
  width: '23%',
  height: '20%',
  padding: '0 1% 0 1%',
  fontSize: '1.5rem',
  border: 'none',
  borderBottom: '1px solid white',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  zIndex: 333,
});

const ButtonContainer = glamorous.div({
  margin: 'auto',
  width: '23%',
  height: '20%',
  display: 'flex',
  justifyContent: 'space-between',
  zIndex: 333
});

const Button = glamorous.button({
  width: '47%',
  borderRadius: '3px',
  backgroundColor: 'transparent',
  color: 'white',
  fontWeight: 600,
  zIndex: 333,
  border: '1px solide white',
  ':hover': { color: 'black', backgroundColor: 'white', cursor: 'pointer' },
  ':focus': { color: 'black', backgroundColor: 'white' }
});

const shakeAnimation = keyframes`${headShake}`;
const Wrapper = styled.section`
  animation: 1s ${shakeAnimation};
  text-align: center;
  `;

class Login extends Component {
  state = { 
    modal: true,
    username: "",
    password: "",
    tooltipUsername: false,
    loginError: false
  }

  handleLogin = () => {
    const { username, password } = this.state;
    axios
      .post("https://lambdanotes-jeffreyflynn.herokuapp.com/api/login", { username, password })
      .then(res => localStorage.setItem('Authorization', res.data.token))
      .then(redirect => this.props.history.push('/home'))
      .then(img => document.getElementById('background').classList.remove('background'))
      .then(state => this.setState({ username: "", password: "" }))
      .catch(err => this.setState({ loginError: true }))
  }

  handleNewUser = () => {
    const { username, password } = this.state;
    axios
      .post("https://lambdanotes-jeffreyflynn.herokuapp.com/api/users", { username, password })
      .then(user => this.handleLogin())
      .catch(err => this.setState({ loginError: true }))
  }

  render() {
    return (
      <Container>
        <Input 
          type="text"
          name="username"
          placeholder="username"
          value={this.state.username}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
          className="login_input"
        />
        <Input 
          type="password"
          name="password"
          placeholder="password"
          value={this.state.password}
          onChange={event => this.setState({ [event.target.name]: event.target.value })}
          className="login_input"
        />
        <ButtonContainer>
          <Button onClick={() => this.handleLogin()}>Login</Button>
          <Button onClick={() => this.handleNewUser()}>Register</Button>
        </ButtonContainer>
        </Container>
      /*<div className="PrimaryContainer__login">
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="w-100 d-flex justify-content-center">Login</ModalHeader>
          {this.state.loginError ? (
            <Wrapper>
              <ModalBody className="mx-auto text-danger">You must enter a valid username and password.</ModalBody>
            </Wrapper>
          ) : (
            <ModalBody className="mx-auto">Please login to view your notes.</ModalBody>
          )}
          <Form>
            <FormGroup className="mx-auto col-8">
              <Input 
                type="text" 
                name="username" 
                id="tooltipUsername" 
                placeholder="username" 
                onChange={event => this.setState({ [event.target.name]: event.target.value })}
              />
            </FormGroup>
            <FormGroup className="mx-auto mb-4 col-8">
              <Input 
                type="password" 
                name="password" 
                id="tooltipPassword" 
                placeholder="password" 
                onChange={event => this.setState({ [event.target.name]: event.target.value })}
                />
            </FormGroup>
          </Form>
          <ModalFooter>
            <Button onClick={() => this.handleLogin()} className="Nav__ButtonsContainer--navButton" >Login</Button>
            <Button onClick={() => this.handleNewUser()} className="Nav__ButtonsContainer--navButton bg-secondary" >Register</Button>
          </ModalFooter>
        </Modal>
        </div>*/
    )
  }
}

export default Login;