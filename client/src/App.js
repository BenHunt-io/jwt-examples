import logo from './logo.svg';
import './App.css';
import * as jose from 'jose';
import React from 'react';
import { Buffer } from 'buffer';
import { Col, Container, Row } from 'react-bootstrap';


const algo = { 
  
  name: "RSA-OAEP", 
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]), // 65537
  hash: "SHA-256" 

};

export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }

    this.onLogin = this.onLogin.bind(this);
    this.onCreateAccount = this.onCreateAccount.bind(this);

    import('bootstrap-show-password-toggle/js/show-password-toggle.js');

    fetch(new URL("http://localhost:4000/login/publicKey"))
      .then(res => res.json())
      .then(pubKey => {
        return window.crypto.subtle.importKey("jwk", pubKey, algo, false, ["encrypt"]);
      })
      .then(pubKey => {
        this.setState({pubKey});
        console.log(pubKey);
      })
  }

  onLogin() {
    let passwordBuffer = Buffer.from(this.state.password, 'utf8');
    window.crypto.subtle.encrypt(algo, this.state.pubKey, passwordBuffer)
      .then(encryptedPassword => {

        console.log(Buffer.from(Buffer.from(encryptedPassword).toString('base64')));

        return fetch(new URL("http://localhost:4000/login"), {
          method: 'POST',
          headers: {
            'Content-Type' : "application/json;charset=utf8",
            'Accept' : '*/*',
          },
          body: JSON.stringify({
            username: this.state.username,
            password: Buffer.from(encryptedPassword).toString('base64')
          })
        })
      })
      .then(res => res.json())
      .then(loginResponse => {
        console.log(loginResponse);
      })
  }

  onCreateAccount(){
    let passwordBuffer = Buffer.from(this.state.password, 'utf8');
    window.crypto.subtle.encrypt(algo, this.state.pubKey, passwordBuffer)
      .then(encryptedPassword => {
        return fetch(new URL("http://localhost:4000/user"), {
          method: 'POST',
          headers: {
              'Content-Type' : "application/json;charset=utf8",
              'Accept' : '*/*',
          },
          body: JSON.stringify({
            username: this.state.username,
            password: Buffer.from(encryptedPassword).toString('base64')
          })
        })
      })
      .then(res => res.json())
      .then(user => {
        console.log(`User created: ${user}`);
      })
  
  }

  render() {
    return (
      <div className="container py-5">
        <div className="row justify-content-center py-2">
          <div className="col-4">
            <div className="form-floating">
              <input id="usernameInput" onChange={(e) => this.setState({ username: e.target.value })}
                className="form-control" placeholder='Username' />
              <label for="usernameInput">Username</label>
            </div>
          </div>
        </div>

        <div className="row justify-content-center py-2">
          <div className="col-4">
            <div className="form-floating">
              <input type='password' id="passwordInput" className="form-control"
                onChange={(e) => this.setState({ password: e.target.value })} placeholder='Password' />
              <button id="toggle-password" type="button" className="d-none" />
              <label for="passwordInput">Password</label>
            </div>
          </div>
        </div>


        <div className="row justify-content-center py-2">
          <div className="col-4">
            <div className="d-grid gap-2">
              <button type='button' className="btn-md btn-primary" onClick={this.onLogin}>Login</button>
            </div>
          </div>
        </div>

        <div className="row justify-content-center py-2">
          <div className="col-4">
            <div className="d-grid gap-2">
              <button type='button' className="btn-md btn-primary" onClick={this.onCreateAccount}>Create Account</button>
            </div>
          </div>
        </div>

      </div>
    );
  }

}