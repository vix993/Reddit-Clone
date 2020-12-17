import 'reflect-metadata';
// import { MikroORM } from '@mikro-orm/core';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
// import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import path from 'path';
import { Updoot } from './entities/Updoot';
import { createUserLoader } from './utils/createUserLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';

// rerun
const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        migrations: [path.join(__dirname, "./migrations/*")],
        port: 1234,
        entities: [Post, User, Updoot],
    });
    conn.runMigrations();
    // const orm = await MikroORM.init(microConfig);
    // orm.em.nativeDelete(User, {}); in case of database discrepancies (development)
    // await orm.getMigrator().up();

    // await Post.delete({});

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }))

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookie only works in https
            },
            saveUninitialized: false,
            secret: "athepsuthjqmchazcx",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
         schema: await buildSchema({
             resolvers: [HelloResolver, PostResolver, UserResolver],
             validate: false,
         }),
         context: ({ req, res }) => (
             {
                 req,
                 res,
                 redis,
                 userLoader: createUserLoader(),
                 updootLoader: createUpdootLoader(),
             }),
    });

    apolloServer.applyMiddleware({ app, cors: false, });

    app.listen(4000, () => {
        console.log("server started on localhost:4000")
    })
}

main().catch((err) => {
    console.error(err);
});