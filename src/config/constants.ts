import environment from './environments';

if (process.env.NODE_ENV !== 'production') {
    const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'JoeyElJodidoAmo';

export enum COLLECTIONS{
    USERS = 'users'
}

export enum MESSAGES{
    TOKEN_VERIFICATION_FAILED = 'Token incorrecto, inicia sesion nuevamente'
}

export enum EXPIRETIME{ 
    H1 = 60*60,
    H24 = 24*H1,
    M20 = H1/3,
    M15 = H1/4
}