const Router = require('../Router')

class TestRouter extends Router {

    getServices() {
        return {
            'GET /'         : 'getFrom',
            '/hello'        : 'getFromHello',
            'POST /world'   : 'postFromWorld'
        }
    }

    getFrom(req, res) {
        res.send('GET HELLO WORLD FROM /')
    }

    getFromHello(req, res) {
        res.send('GET HELLO WORLD FROM /hello')
    }

    postFromWorld(req, res) {
        res.send('POST HELLO WORLD TO /world')
    }
}

module.exports = TestRouter;