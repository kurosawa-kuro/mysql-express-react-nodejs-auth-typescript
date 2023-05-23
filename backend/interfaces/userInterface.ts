// backend\interfaces\userInterface.ts

export interface FullUser {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

export interface LoginCredentials {
    password: string;
    email: string;
}

export interface UserUpdateData {
    userId: number;
    name: string;
    email: string;
}

export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
};
