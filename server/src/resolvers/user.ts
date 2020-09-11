import {
    Resolver,
    Mutation,
    Arg,
    InputType,
    Field,
    Ctx,
    ObjectType,
    Query
} from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from 'argon2';
import { EntityManager } from '@mikro-orm/postgresql';

// creating an input object

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(() => User, {nullable: true})
    async me(
         @Ctx() {req, em}: MyContext
    ) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User, { id: req.session.userId })
        return user;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'length must be greater than 2',
                    },
                ]
            }
        }
        if (options.password.length <= 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'length must be greater than 3',
                    },
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
                username: options.username,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning("*");
            user = result[0]
        } catch (error) {
            // duplicate username error
            if (error.code === "23505"){
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken',
                        },
                    ]
                };
            }
        }

        req.session.userId = user.id;
        
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username })
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'Username doesn`t exist',
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'User info does not match our records',
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }
}