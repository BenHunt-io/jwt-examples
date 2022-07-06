const http = require('http');
const { subtle } = require('crypto').webcrypto;
const UserRepository = require('./src/UserRepository');

/**
 * Exports the public key
 */
 let keyPair = null;
 let pubKeyExport = null;
 let userRepo = new UserRepository();

 const algo = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]), // 65537
    hash: "SHA-256"
 }
 
 /**
  * Generate key before starting the server.
  */
createKey()
     .then(generatedKeyPair => {
         keyPair = generatedKeyPair;
         return exportKey(generatedKeyPair.publicKey);
     })
     .then(exportedPublicKey => {
         pubKeyExport = exportedPublicKey;
     })
     // Start the server and listen for new requests
     .then(() => {
        http.createServer((req, res) => {

            let url = new URL(req.url, `http://${req.headers.host}`);

            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader("Access-Control-Content-Type", "application/json;charset=utf8");


            if(req.method == 'OPTIONS'){
                res.statusCode = 200;
                res.end();
                return;
            }
            else if(url.pathname == "/publicKey"){
                
                let pubKeyAsString = JSON.stringify(pubKeyExport);
                let pubKeyBuffer = Buffer.from(pubKeyAsString, 'utf8');
                res.write(pubKeyBuffer, (error) => {
                    if(error){
                        console.log("Error occured writing public key to response.")
                    }else{
                        console.log("Successfully wrote public key to response.")
                    }
                })

                res.statusCode = 200;
                res.end();
            }
            else if(url.pathname == "/login"){

                let body = '';
                req.on('data', buffer => {
                   body += buffer.toString('utf8');
                })

                req.on('end', () => {
                    let user = JSON.parse(body);
                    let persistedUser = userRepo.findUserByName(user.username);
                    let encryptedPasswordBuffer = Buffer.from(user.password, 'base64');
                    let persistedEncryptedPasswordBuffer = Buffer.from(persistedUser.password, 'base64');

                    Promise.all([subtle.decrypt(algo, keyPair.privateKey, encryptedPasswordBuffer),
                        subtle.decrypt(algo, keyPair.privateKey, persistedEncryptedPasswordBuffer)])
                        .then(([password, persistedPassword]) => {
                            if(Buffer.from(password).toString('utf8') == Buffer.from(persistedPassword).toString('utf8')){
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json;charset=utf8;");
                                res.write(JSON.stringify({"success": "User authenticated"}));
                                res.end();
                            }
                            else{
                                res.statusCode = 401;
                                res.setHeader("Content-Type", "application/json;charset=utf8;");
                                res.write(JSON.stringify({"error": "Unauthorized"}));
                                res.end();
                            }
                        })
                })
            }
            else if(url.pathname == "/user"){
                let body = '';
                req.on('data', buffer => {
                   body += buffer.toString('utf8');
                })

                req.on('end', () => {
                    let user = JSON.parse(body);
                    userRepo.createUser(user);
                    res.write(JSON.stringify(user), 'utf8');
                })

                res.setHeader("Content-Type", "application/json;charset=utf8;");
                res.statusCode = 201;
            }

        })
        .listen(4000, () => {
            console.log("server running at port 4000");
        })
        
     })

async function createKey() {
    //(RSA/SHA/etc), exportable=true, key usage
    return subtle.generateKey(algo, true, ['encrypt', 'decrypt']);
}

async function exportKey(key){
    return subtle.exportKey('jwk', key);
}