
class UserAPI {

    constructor(userRepo){
        this.userRepo = userRepo;
    }

    createUser(req, res){
        let body = '';
        req.on('data', buffer => {
           body += buffer.toString('utf8');
        })

        req.on('end', () => {
            let user = JSON.parse(body);
            this.userRepo.createUser(user);
            res.write(JSON.stringify(user), 'utf8');
        })

        res.setHeader("Content-Type", "application/json;charset=utf8;");
        res.statusCode = 201;
    }

}


module.exports = UserAPI;