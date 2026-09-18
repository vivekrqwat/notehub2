interface AppConfig01 {
  readonly Login: string;
  readonly GETDir: string;
  readonly Notes_Route: string;
  readonly Task_Route: string;
  readonly Images_Route: string;
}

const ALLPATH: AppConfig01 = Object.freeze({
  Login: `/notehub/loginuser/login`,
  GETDir: `/notehub/dir`,
  Notes_Route: `notes`,
  Task_Route: `task`,
  Images_Route: `images`,
});


export default ALLPATH;