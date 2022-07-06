import logo from './logo.svg';
import './App.css';
import * as jose from 'jose';
import React from 'react';
import { Buffer } from 'buffer';
import { Col, Container, Row } from 'react-bootstrap';


const algo = { name: "HMAC", hash: { name: "SHA-256" } };

export class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataVerified: "n/a",
      keyRepresentation: {
        type: "n/a",
        algo: "n/a",
        usages: "n/a"
      },
      signatureRepresentation: "n/a",
      signatureValid: "n/a"
    }

    this.onCreateKey = this.onCreateKey.bind(this);
    this.onSign = this.onSign.bind(this);
    this.onVerify = this.onVerify.bind(this);

  }



  onCreateKey(secret) {
    createKey(secret).then(key => {
        let keyRepresentation = getKeyRepresentation(key);
        this.setState({
          keyRepresentation: keyRepresentation,
          key:key
        })
    });
  }

  onSign(){
    sign_hmac_sha256(this.state.data, this.state.key)
      .then(signature => this.setState({
        signature,
        // Represent the bytes of the signature as a base64 string
        signatureRepresentation: Buffer.from(signature).toString('base64')
      }))
  }

  onVerify(){
    
    let encoder = new TextEncoder();
    let dataBuffer = encoder.encode(this.state.data).buffer;
    crypto.subtle.verify(algo.name, this.state.key, this.state.signature, dataBuffer)
      .then(signatureValid => this.setState({signatureValid: signatureValid.toString()}));

  }

  onClick() {

    createKey("password").then(key => {
      createJWT(key)
        .then(jwt => verify(key, jwt))
        .then(isAuthentic => {
          this.setState({
            dataVerified: isAuthentic.toString()
          });
        });
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-6">
            {/* Input */}
            <div className="container py-5">
              <div className="row justify-content-center py-2">
                <div className="col-8">
                  <div class="form-floating">
                    <input id="txRecipientInput" onChange={(e) => this.setState({data: e.target.value})}
                      class="form-control" placeholder='Transaction Recipient' />
                    <label for="txRecipientInput">Transaction Recipient</label>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center py-2">
                <div className="col-8">
                  <div class="form-floating">
                    <input id="secretInput" class="form-control" placeholder='Secret'
                      onChange={(e) => this.setState({secret: e.target.value})}/>
                    <label for="secretInput">Secret</label>
                  </div>
                </div>
              </div>


              <div className="row justify-content-center py-2">
                <div className="col-8">
                  <div class="d-grid gap-2">
                    <button type='button' className="btn-md btn-primary" onClick={this.onCreateKey}>Create Key</button>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center py-2">
                <div className="col-4">
                  <div class="d-grid gap-2">
                    <button type='button' className="btn-md btn-primary" onClick={this.onSign}>Sign</button>
                  </div>
                </div>
                <div className="col-4">
                  <div class="d-grid gap-2">
                    <button type='button' className="btn-md btn-primary" onClick={this.onVerify}>Verify</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Output */}
          <div className="col-6">
            <div className="container py-5">
              <div className="row justify-content-center py-2">
                <div className="col-8">
                  <h5>Key</h5>
                  <p>Type: {this.state.keyRepresentation.type}</p>
                  <p>Algo: {this.state.keyRepresentation.algo}</p>
                  <p>Usages: {this.state.keyRepresentation.usages}</p>
                  <h5>Signature</h5>
                  <p>Signature: {this.state.signatureRepresentation}</p>
                  <p>Signature Valid: {this.state.signatureValid}</p>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>
    );
  }

}


function getKeyRepresentation(key){

  let keyRepresentation = {};

  if(key.type == 'secret'){
    keyRepresentation.type = "Symmetric Key";
  }else if(key.type == 'private'){
    keyRepresentation.type = 'Asymmetric Private Key';
  }
  else if(key.type == 'public'){
    keyRepresentation.type ='Asymmetric Public Key';
  }

  keyRepresentation.algo = key.algorithm.name;
  keyRepresentation.usages = key.usages.join(', ');

  return keyRepresentation;
}

function getKeyType(key){
  if(!key){
    return "n/a";
  }

  if(key.type == 'secret'){
    return "Symmetric Key";
  }else if(key.type == 'private'){
    return 'Asymmetric Private Key';
  }
  else if(key.type == 'public'){
    return 'Asymmetric Public Key';
  }
}

async function createKey(secret) {

  let textEncoder = new TextEncoder();

  return crypto.subtle.importKey(
    "raw", // format
    textEncoder.encode(secret), // key data, encodes using utf8
    algo, // algorithmn (RSA/SHA/etc)
    false,
    ['sign', 'verify'] // key usage
  );

}

async function createJWT(key) {

  let header = {
    'alg': 'RS256',
    'typ': 'JWT',
  };

  let payload = {
    "sub": "123",
    "name": "John Smith",
    "admin": true
  }

  const encodedHeader = Buffer.from(JSON.stringify(header), 'utf8').toString('base64');
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');

  return sign_hmac_sha256(`${encodedHeader}${encodedPayload}`, key)
    .then(hmac => Buffer.from(hmac).toString('base64'))
    .then(encodedSignature => `${encodedHeader}.${encodedPayload}.${encodedSignature}`)
    .then(jwt => {

      let [header, payload, sig] = jwt.split('.');
      console.log(`Header: \n${header}`);
      console.log(`Payload: \n${payload}`);
      console.log(`Signature: \n${sig}`);

      return jwt;
    });
}

async function sign_hmac_sha256(message, key) {
  const enc = new TextEncoder("utf-8");

  const signature = await crypto.subtle.sign(
    algo.name,
    key,
    enc.encode(message)
  );

  return signature;
}


async function verify(key, jwt) {

  let [encodedHeader, encodedPayload,
    encodedSignature] = jwt.split('.');

  let decodedData = Buffer.from((`${encodedHeader}${encodedPayload}`), 'base64');
  let decodedSignature = Buffer.from(encodedSignature, 'base64');

  let isAuthentic = await crypto.subtle.verify(algo.name, key, decodedSignature, decodedData);

  return isAuthentic;

}