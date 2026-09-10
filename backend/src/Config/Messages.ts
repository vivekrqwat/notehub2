interface MessagesIn{
    WrongCred:string,
    User:string,
    ENV:string
}


const Messages:MessagesIn=Object.freeze({
    WrongCred:"wrong Credential",
    User:"User already registered.",
    ENV:"Server Error "
}

)

export default Messages