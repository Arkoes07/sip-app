class Router {
    constructor(routePath,app){
        if(app == null) {
            throw new Error("Missing required App")
        }
        this.app = app
        this.routePath = routePath
        this.registerServices()
    }

    getServices() { return {} }

    registerServices() {
        let routerServices = this.getServices();
        Object.keys(routerServices).forEach( fullPath => {
            let serviceFunction = routerServices[fullPath]
            let pathItems = fullPath.split(' ')
            let verb = (pathItems.length > 1 ? pathItems[0] : 'get').toLowerCase()
            let path = this.routePath + (pathItems.length > 1 ? pathItems[1] : fullPath)
            this.app[verb](path, this[serviceFunction].bind(this))
        });
    }
}

module.exports = Router;