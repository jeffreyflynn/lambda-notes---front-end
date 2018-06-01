import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Tooltip } from 'reactstrap'; // Input, Button
import { headShake } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import FaQuestionCircleO from 'react-icons/lib/fa/question-circle-o';
import glamorous from 'glamorous';
import { GoogleAPI, GoogleLogin } from 'react-google-oauth';

const Container = glamorous.div({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignContent: 'center',
  zIndex: 333
});

const Input = glamorous.input({
  margin: '0.5% auto 0.5%',
  width: '23%',
  padding: '0 1% 0 1%',
  fontSize: '1.5rem',
  border: 'none',
  borderBottom: '1px solid #D7D7D7',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  zIndex: 333,
});

const ButtonContainer = glamorous.div({
  margin: '1% auto 1%',
  display: 'flex',
  justifyContent: 'center', 
  width: '23%',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 333
});

const Button = glamorous.button({
  width: '47%',
  margin: '0 auto 0',
  padding: '0.5%',
  borderRadius: '3px',
  backgroundColor: 'transparent',
  color: 'white',
  fontWeight: 700,
  textShadow: '1px 1px gray',
  zIndex: 333,
  border: '1px solide #D7D7D7',
  ':hover': { color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' },
  ':focus': { color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.6)' }
});

const Icon = glamorous.div({
  zIndex: 333,
  color: 'white',
  position: 'fixed',
  top: 10,
  right: 20,
  ':hover': { cursor: 'pointer', transform: 'scale(1.25)' }
});

const Google = glamorous.div({
  width: '100%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  margin: '0 auto 0'
})

const Header = glamorous.div({
  fontFamily: 'Cinzel, serif',
  fontWeight: '600',
  fontSize: '5rem',
  margin: 'auto',
  position: 'absolute',
  top: 25,
  left: '35%',
  color: '#D7D7D7',
  zIndex: '101010',
  textShadow: '2px 2px 4px black'
})

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
    tooltipQuestion: false,
    loginError: false
  }

  componentDidMount() { document.getElementById('background').classList.add('background') }

  toggleTooltip = () => { this.setState({ tooltipQuestion: !this.state.tooltipQuestion })
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
      .post("https://lambdanotes-jeffreyflynn.herokuapp.com/api/login/register", { username, password })
      .then(user => this.handleLogin())
      .catch(err => this.setState({ loginError: true }))
  }

  handleGoogleAuth = googleUser => {
    const accessToken = { access_token: googleUser.getAuthResponse().access_token };
    axios
      .post("https://lambdanotes-jeffreyflynn.herokuapp.com/api/login/oauth/google", accessToken)
      .then(res => localStorage.setItem('Authorization', res.data.token))
      .then(redirect => this.props.history.push('/home'))
      .then(img => document.getElementById('background').classList.remove('background'))
      .catch(err => console.log('error!!!', err))
  }

  render() {
    return (
      <Container>
        <Header>Lambda Notes</Header>
        <Icon><FaQuestionCircleO className="icon" id="tooltipQuestion" /></Icon>
        <Tooltip 
          placement="left" 
          isOpen={this.state.tooltipQuestion}
          target="tooltipQuestion"
          toggle={() => this.toggleTooltip()}
          >Learn more about this project.</Tooltip>
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
        <Google>
          <GoogleAPI clientId="962293448005-vas5rftptuuqf6tcueb9ismhmojn32oq.apps.googleusercontent.com">
            <GoogleLogin 
              onLoginSuccess={user => this.handleGoogleAuth(user)} 
              backgroundColor="rgba(255, 255, 255, 0.3)" 
              width="23%" 
              className="rounded"
              /> 
          </GoogleAPI>
        </Google>
      </Container>  
    )
  }
}

export default Login;