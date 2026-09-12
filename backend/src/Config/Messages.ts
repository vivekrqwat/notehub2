interface MessagesIn{
    WrongCred:string,
    User:string,
    ENV:string,
    Nouser:string
}


const Messages:MessagesIn=Object.freeze({
    WrongCred:"wrong Credential",
    User:"User already registered.",
    ENV:"Server Error ",
    Nouser:"NO user Found"
}

)

export default Messages