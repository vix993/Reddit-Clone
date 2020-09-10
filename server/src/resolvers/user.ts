import { Resolver, Query, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import argon2 from 'argon2';

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
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
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
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {
            username: options.username,
            password: hashedPassword
        })
        try {
            await em.persistAndFlush(user)
        } catch (error) {
            // duplicate username error
            if (error.code === "23505" || error.detail.includes("already exists")){
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
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
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
        return {
            user,
        };
    }
}