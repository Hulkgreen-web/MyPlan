import bcrypt from 'bcrypt';

export interface UserMock {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export const mockUser1: UserMock = {
    id: 'user-1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('password1', 10),
    name: 'User 1',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockUser2: UserMock = {
    id: 'user-2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('password2', 10),
    name: 'User 2',
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const mockUserList: UserMock[] = [
    mockUser1,
    mockUser2,
];