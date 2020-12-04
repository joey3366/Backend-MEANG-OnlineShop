import { IJwt } from './../interfaces/jwt.interface';
import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';
class Jwt {
    private secretKey = SECRET_KEY as string;

    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24){
        return jwt.sign(
            {user: data.user},
            this.secretKey,
            {expiresIn} // Un dia
        );
    }

    verify(token: string){
        try {
            return jwt.verify(token,this.secretKey);
        } catch (error) {
            return MESSAGES.TOKEN_VERIFICATION_FAILED;
        }
    }
}

export default Jwt;