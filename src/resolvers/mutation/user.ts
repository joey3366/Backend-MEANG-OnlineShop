import { asignDocumentId, findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTIONS } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const resolverUserMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }){
                
            // Comprobar que el usuario no exista
            const userChek = await findOneElement( db, COLLECTIONS.USERS, {email: user.email} );

            if (userChek !== null) {
                return {
                    status: false,
                    message: `El usuario ${user.email} ya se encuentra registrado`,
                    user: null
                };
            }
            // Comprobar el ultimo usuario registrado

            user.id = await asignDocumentId(db, COLLECTIONS.USERS, { registerDate: -1 });

            //Asignar fecha de registro
            user.registerDate = new Date().toISOString();
            user.password = bcrypt.hashSync(user.password, 12);

            //Guardar datos

            return await insertOneElement(db, COLLECTIONS.USERS, user)
                        .then(async () => {
                            return {
                                status: true,
                                message: 'Usuario registrado Satisfactoriamente',
                                user
                            };
                        }).catch((err: Error) => {
                            console.log(err.message);
                            return {
                                status: false,
                                message: 'Error Inesperado',
                                user: null
                            };
                        });
        }
    }
};

export default resolverUserMutation;