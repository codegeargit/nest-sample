
export class Config {
    public isDevelopment(): boolean {
        return process.env.BACKEND_ENV === 'dev';
    }
    public isProduction(): boolean {
        return process.env.BACKEND_ENV === 'prod';
    }
}