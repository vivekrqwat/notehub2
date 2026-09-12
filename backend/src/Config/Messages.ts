interface MessagesIn{
    WrongCred:string,
    User:string,
    ENV:string,
    Nouser:string,
    NoNOtes:string
}


const Messages:MessagesIn=Object.freeze({
    WrongCred:"wrong Credential",
    User:"User already registered.",
    ENV:"Server Error ",
    Nouser:"NO user Found",
    NoNOtes:"No NOtes found"
}

)

export default Messages