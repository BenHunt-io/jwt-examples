const { subtle } = require('crypto').webcrypto;

class LoginAPI {

    constructor(userRepo){
        this.algo = {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256"
        }
        this.userRepo = userRepo;
             
    }

    login(req, res){
        let body = '';
        req.on('data', buffer => {
           body += buffer.toString('utf8');
        })

        req.on('end', () => {
            let user = JSON.parse(body);
            let persistedUser = this.userRepo.findUserByName(user.username);
            let encryptedPasswordBuffer = Buffer.from(user.password, 'base64');
            let persistedEncryptedPasswordBuffer = Buffer.from(persistedUser.password, 'base64');

            Promise.all([subtle.decrypt(this.algo, this.keyPair.privateKey, encryptedPasswordBuffer),
                subtle.decrypt(this.algo, this.keyPair.privateKey, persistedEncryptedPasswordBuffer)])
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
    
    
    getPublicKey(req, res){
        let pubKeyAsString = JSON.stringify(this.pubKeyExport);
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

    async setupKeys(){
        //(RSA/SHA/etc), exportable=true, key usage
        return subtle.generateKey(this.algo, true, ['encrypt', 'decrypt'])
            .then(keyPair => {
                this.keyPair = keyPair;
                return subtle.exportKey('jwk', keyPair.publicKey);
            })
            .then(exportedPubKey => {
                this.pubKeyExport = exportedPubKey;
            })
    }
}

module.exports = LoginAPI;