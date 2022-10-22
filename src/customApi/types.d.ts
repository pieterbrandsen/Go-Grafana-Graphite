interface StringMap<T> { [key: string]: T; }

interface Config {
    code: string;
    email: string;
    username: string;
    targetUsername?: string;
    password: string;
    role: "Viewer" | "Editor" | "Admin";
}

interface ApiResponse {
    code: number;
    message: string;
}