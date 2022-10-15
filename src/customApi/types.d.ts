interface StringMap<T> { [key: string]: T; }

interface Config {
    email?: string;
    username: string;
    password: string;
    targetUsername?: string;
    role: "Viewer" | "Editor" | "Admin";
}

interface ApiResponse {
    code: number;
    message: string;
}