export interface User {
    id: string;
    username: string;
    password: string;
    role: 'student' | 'admin';
    name: string;
  }