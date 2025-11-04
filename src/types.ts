export interface User {
    id: number,
    name: string,
    email: string,
    company: string,
    role: 'user' | 'admin' | 'editor'
    createdAt: string
}