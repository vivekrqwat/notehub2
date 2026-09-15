
const OriginalPAth="/notehub/"

interface AppConfig01{
    readonly Login_SignUP:string;
    readonly Dir_Route:string;
    readonly Notes_Route:string;
    readonly Task_Route:string
    readonly Images_Route:string
}

 const Config:AppConfig01=Object.freeze({
    Login_SignUP:`${OriginalPAth}loginuser`,
    Dir_Route:`${OriginalPAth}dir`,
    Notes_Route:`${OriginalPAth}notes`,
    Task_Route:`${OriginalPAth}task`,
    Images_Route:`${OriginalPAth}images`

})

export default Config