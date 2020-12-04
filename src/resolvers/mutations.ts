import { COLLECTIONS } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const mutations: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }){
                
            // Comprobar que el usuario no exista
            const userChek = await db.collection(COLLECTIONS.USERS)
            .findOne({email: user.email});

            if (userChek !== null) {
                return {
                    status: false,
                    message: `El usuario ${user.email} ya se encuentra registrado`,
                    user: null
                };
            }
            // Comprobar el ultimo usuario registrado
            const lastUser = await db.collection(COLLECTIONS.USERS)
            .find().limit(1).sort({registerDate: -1}).toArray();

            if (lastUser.length === 0) {
                user.id = 1;
            }else{
                user.id = lastUser[0].id + 1;
            }

            //Asignar fecha de registro
            user.registerDate = new Date().toISOString();
            user.password = bcrypt.hashSync(user.password, 12);

            //Guardar datos

            return await db.collection(COLLECTIONS.USERS).
                        insertOne(user)
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

export default mutations;