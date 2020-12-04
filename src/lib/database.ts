import MongoClient from 'mongodb';
import chalk from 'chalk';
class Database {
    async init() {
        const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017/OnlineShopDatabase';
        const client = await MongoClient.connect(
            MONGO_DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }

        );
        const db = client.db();
        if (client.isConnected()) {
            console.log(chalk.yellowBright('DB Is Connected'));
        }

        return db;
    }
}

export default Database;