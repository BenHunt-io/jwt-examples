const http = require('http');
const LoginAPI = require('./src/controller/LoginAPI');
const UserAPI = require('./src/controller/UserAPI');
const { intercept } = require('./src/controller/proxy/RequestInterceptor');
const UserRepository = require('./src/repository/UserRepository');


const httpPort = 4000;

/**
 * Exports the public key
 */
let userRepo = new UserRepository();
let loginAPI = new LoginAPI(userRepo);
let userAPI = new UserAPI(userRepo);
setupProxies();

loginAPI.setupKeys()
     // Start the server and listen for new requests
     .then(() => {
        http.createServer((req, res) => {

            let url = new URL(req.url, `http://${req.headers.host}`);

            switch(url.pathname){
                case '/login/publicKey' : loginAPI.getPublicKey(req, res);
                    break;
                case '/login' : loginAPI.login(req, res);
                    break;
                case '/user' : userAPI.createUser(req, res);
                    break;
            }
        })
        .listen(httpPort, () => {
            console.log(`server running at port ${httpPort}`);
        })
     })

function setupProxies(){
    loginAPI.getPublicKey = intercept(loginAPI.getPublicKey);
    loginAPI.login = intercept(loginAPI.login);
    userAPI.createUser = intercept(userAPI.createUser);
}