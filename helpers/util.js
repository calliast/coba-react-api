class Response {
    constructor(data, success = true) {
        this.success = success
        this.data = data
    }
}

module.exports = {
    Response
}