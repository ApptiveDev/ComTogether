export interface User {
    id: string;
    name: string;
    email: string;
    role: 'BEGINNER' |  'EXPERT';
    loginMethod: 'KAKAO';
    socialId: string;
    points: number;
    initialized: boolean;
}