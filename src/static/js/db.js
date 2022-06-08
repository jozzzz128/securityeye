const db = {
    users: [],
    registerUser: userId => {
        const {user} = userExists(userId);
        if(!user){
            db.users.push({
                id: userId,
                clients: [],
            });
            return db.users; 
        }
        return false;
    },
    registerClient: (userId, clientId, alias) => {
        const {user, index} = userExists(userId);
        if(user){
            const client = clientExists(userId, clientId);
            if(!client){
                db.users[index].clients.push({
                    id: clientId,
                    alias: alias
                });
                return db.viewClients(userId);
            }
        }
        return false;
    },
    deleteClient: (userId, clientId) => {
        const {user, index} = userExists(userId);
        if(user){
            const client = clientExists(userId, clientId);
            if(client) db.users[index].clients = db.users[index].clients.filter( client => client.id != clientId );
            return db.viewClients(userId);
        }
        return false;
    },
    viewClients: userId => {
        const {user, index} = userExists(userId);
        if(user) return db.users[index].clients;
        return false;
    }
};

function userExists(userId){
    let index = 0;
    const exists = db.users.some( (user, i) => {
        index = i;
        return user.id == userId;
    });
    if(exists) return {user: true, index: index};
    return false;
}
function clientExists(userId, clientId){
    const {user, index} = userExists(userId);
    if(user){
        const clientExists = db.users[index].clients.some( client => client.id == clientId);
        if(clientExists) return true;
    }
    return false;
}

module.exports = db;