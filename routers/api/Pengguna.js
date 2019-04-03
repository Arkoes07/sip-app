const Router = require('../Router')

class Pos extends Router {

    getServices() {
        return {
            'POST /login'    : 'userLogin',
            'POST /signup'   : 'userSignup'
        }
    }

    userLogin(req,res) {
        res.json({msg: 'user login proced' });
    }

    userSignup(req,res) {
        res.json({ msg: 'user signed up' });
    }

}

module.exports = Pos;