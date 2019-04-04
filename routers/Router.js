const client = require('../config/db')
client.connect()
const JwtOperation = require('../middleware/JwtOperation')

class Router {
    constructor(routePath,app){
        if(app == null) {
            throw new Error("Missing required App")
        }
        this.app = app
        this.routePath = routePath
        this.jwtOp = new JwtOperation()
        this.client = client
        this.registerServices()
    }

    getServices() { return {} }

    registerServices() {
        let routerServices = this.getServices();
        // "GET /" : "namaFungsi"
        Object.keys(routerServices).forEach( fullPath => {
            // functions
            let contentData = routerServices[fullPath].split(' ') 
            let serviceFunction = contentData[0]

            // requests
            let pathItems = fullPath.split(' ') // ["GET","/"]
            let verb = (pathItems.length > 1 ? pathItems[0] : 'get').toLowerCase()
            let path = this.routePath + (pathItems.length > 1 ? pathItems[1] : fullPath)
            
            // install
            if(typeof contentData[1] !== "undefined"){
                // have middleware
                let middleware = contentData[1]
                this.app[verb](path, this.jwtOp[middleware].bind(this) ,this[serviceFunction].bind(this))
            }else{
                this.app[verb](path, this[serviceFunction].bind(this))
            }
        })
    }
}

module.exports = Router
