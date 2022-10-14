interface StringMap<T> { [key: string]: T; }

interface Config {
    email?: string;
    username: string;
    password: string;
}

interface ApiResponse {
    code: number;
    message: string;
}