const User = require('../models/Users')
module.exports = function checkRBAC(document, userId){
    User.findOne({ _id: userId })
    .then(user => {
        // switch(user.role) {
        //     case 'employee':
        //         if(file.owner === user.username) {
        //             return true
        //         }
        //         else {
        //             return false
        //         }
        //         break;
        //     case 'manager':
                

        //     case 'user':
            
        //     case 'admin':
        // }
        return true
    })
}