class ErrorWithStatusCode extends Error {
    constructor(message,status=400) {
        super(message); // (1)
        this.name = "ErrorWithStatusCode"; // (2)
        this.status = status
      }
  }
module.exports= ErrorWithStatusCode