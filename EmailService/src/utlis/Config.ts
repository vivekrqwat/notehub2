interface AppConfig {
    readonly AUTH: string;
    readonly TASKSCHEDULE: string;
}

const origin01 = "/app/notehub/";

const Config: AppConfig = Object.freeze({
    AUTH: `${origin01}auth`,
    TASKSCHEDULE: `${origin01}/taskSchedule`,
});

export default Config;
