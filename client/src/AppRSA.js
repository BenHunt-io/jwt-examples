import logo from './logo.svg';
import './App.css';
import * as jose from 'jose';
import React from 'react';
import {Buffer} from 'buffer';
import { Col, Container, Row } from 'react-bootstrap';


export class AppRSA extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      keyCreated: 'false',
      signed: 'false',
      isAuthentic: 'n/a',
      dataToSign: '',
      dataToVerify: ''
    }

    this.createKey = this.createKey.bind(this);
    this.verify = this.verify.bind(this);
    this.signMessage = this.signMessage.bind(this);

  }

  

  createKey(){
    window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        // Consider using a 4096-bit key for systems that require long-term security
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    ).then(keyPair => {
      this.setState({
        keyCreated: 'true',
        keyPair : keyPair,
      })
    })
  }

  signMessage(){

    let encoder = new TextEncoder('utf8');

    window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      this.state.keyPair.privateKey,
      encoder.encode(this.state.dataToSign),
    ).then(signature => {
      this.setState({
        signed: 'true',
        signature: signature
      })
    })

  }

  verify(){

    let encoder = new TextEncoder('utf8');

    window.crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      this.state.keyPair.publicKey,
      // keyPair.publicKey,
      this.state.signature,
      encoder.encode(this.state.dataToVerify),
    ).then(isAuthentic => {
      this.setState({
        isAuthentic: isAuthentic.toString()
      })
    });

  }

  render() {
    return (
        <Container>
          <Row>
            <Col>
            <label for="signedData">Data to Sign </label>
            <input value={this.state.dataToSign} onChange={(e) => {
              this.setState({dataToSign: e.target.value})
            }} id="signedData"></input>
            </Col>

            <Col>
              <label for="verifyData">Data to Verify </label>
              <input onChange={(e) => this.setState({dataToVerify: e.target.value})} id="verifyData"></input>
            </Col>
          </Row>

          <Row>
            <button onClick={this.createKey}>Create Key</button>
          </Row>
          <Row>
            <button onClick={this.signMessage}>Sign</button>
          </Row>
          <Row>
            <button onClick={this.verify}>Verify</button>
          </Row>

          <p>Key created: {this.state.keyCreated} </p>
          <p>Signed: {this.state.signed} </p>
          <p>Is Authentic: {this.state.isAuthentic} </p>

        </Container>
    );
  }

}

async function createKey(){

return window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  )
}

