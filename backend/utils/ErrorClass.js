class ErrorClass extends Error{
    constructor(message,statuscode=400){
        super(message)
        this.statuscode=statuscode
        this.message=message


    }
}
module.exports=ErrorClass