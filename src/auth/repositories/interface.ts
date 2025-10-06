export interface authServiceLoginProps {
    salt: string;
    hash: string;
    loginOrEmail: string;
}