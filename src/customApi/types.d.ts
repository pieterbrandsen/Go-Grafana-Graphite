interface StringMap<T> { [key: string]: T; }

interface Config {
    email: string;
    username: string;
    targetUsername?: string;
    password: string;
    role: "Viewer" | "Editor" | "Admin";
}

interface ApiResponse {
    code: number;
    message: string;
    func?: string;
}