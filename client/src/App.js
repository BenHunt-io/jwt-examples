import logo from './logo.svg';
import './App.css';
import * as jose from 'jose';
import React from 'react';
import {Buffer} from 'buffer';


export class App extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    console.log(Buffer.from("apple"));
    // createJWT();
    // hmac_rsa256("secret", "password123");
  }

  render() {
    return (
      <div className="App">
          <p>Hello JWT</p>
      </div>
    );
  }

}


function createJWT(){
  let base64 = window.btoa.bind(window);
  let textEncoder = new TextEncoder();
  let utf8 = textEncoder.encode.bind(textEncoder);

  let header = {
    'alg': 'RS256',
    'typ': 'JWT',
  };

  let payload = {
    "sub": "123",
    "name": "John Smith",
    "admin": true
  }
  
  const encodedHeader = base64(utf8(JSON.stringify(header)));
  const encodedPayload = base64(utf8(JSON.stringify(payload)));


  const encodedSignature = base64(hmac_rsa256(`${encodedHeader}.${encodedPayload}`,
    "secretKey"));
  
  const jwt = `${encodedHeader}.\n${encodedPayload}.\n${encodedSignature}`;
  
  console.log(`JWT: ${jwt}`);
}

async function hmac_rsa256(message, secret){
  const enc = new TextEncoder("utf-8");
  const algo = {"name":"HMAC", hash: "SHA-256"};
  const key = await crypto.subtle.importKey(
    "raw", // format
    enc.encode(secret), // key data
    algo, // algorithmn (RSA/SHA/etc)
    false, 
    ['sign', 'verify'] // key usage
  );

  const hashBuffer = await crypto.subtle.sign(
    algo.name, 
    key, 
    enc.encode(message)
  );

  console.log(hashBuffer.toString());

  const hashArray = new Uint8Array(hashBuffer);

  // // base 16^2 (2 digit hex) = 2^8 (1 digit uint8)
  // const hashHex = hashArray.map(
  //   b => b.toString(16).padStart(2, '0')
  // ).join('');

  return hashArray;
}


async function verify(secret, jwt){

  let textEncoder = new TextEncoder('utf-8');

  let base64Decode = window.atob.bind(window);
  let textDecoder = new TextDecoder('utf-8');
  let utf8Decode = textDecoder.decode.bind(textDecoder);

  let [encodedHeader, encodedPayload,
    encodedSignature] = jwt.split('.');

  const algo = {"name":"HMAC", hash: "SHA-256"};
  const key = await crypto.subtle.importKey(
    "raw", // format
    textEncoder.encode(secret), // key data
    algo, // algorithmn (RSA/SHA/etc)
    false, 
    ['sign', 'verify'] // key usage
  );

  // hex --> binary --> utf8 string
  let data = utf8Decode(base64Decode(`${encodedHeader}${encodedPayload}`));

  // let isAuthentic = await crypto.subtle.verify(
  //   algo,
  //   key,
    
  // )
}




// new jose.SignJWT({ 'urn:example:claim': true })
//   .setProtectedHeader({ alg: 'ES256' })
//   .setIssuedAt()
//   .setIssuer('urn:example:issuer')
//   .setAudience('urn:example:audience')
//   .setExpirationTime('2h')
//   .sign("privateKey")
//   .then(jwt => console.log(`JWT: ${jwt}`));


