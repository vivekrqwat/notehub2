
const OriginalPAth="/notehub/"

interface AppConfig01{
    readonly Login_SignUP:string;
}

const Config:AppConfig01=Object.freeze({
    Login_SignUP:`${OriginalPAth}loginuser`

})

export default Config