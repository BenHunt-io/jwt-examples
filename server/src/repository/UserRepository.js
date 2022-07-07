class UserRepository {

    constructor(){
        this.database = new Map();
    }

    findUserByName(username){
        if(this.database.has(username)){
            return this.database.get(username);
        }
    }
    
    createUser(user){
        if(!this.database.has(user.username)){
            this.database.set(user.username, user);
            console.debug(`User created: ${JSON.stringify(user, null, 2)}`);
        }
    }
    

}

module.exports = UserRepository;