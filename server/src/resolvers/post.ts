import { MyContext } from "../types";
import { Resolver, Query, Arg, Mutation, Field, InputType, Ctx, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(): Promise<Post[]> {
        return Post.find();
    }
    @Query(() => Post, { nullable: true })
    post(@Arg("id") id: number): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() {req}: MyContext
    ): Promise<Post> {
        //2 sql queries
        return Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }

    // If we want to make things nullable,
    // we must be explicit , () => String, { nullable: true }
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post){
            return null;
        }
        if (typeof title !== 'undefined'){
            await Post.update({id}, {title})
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(@Arg("id", () => Number) id: number): Promise<boolean> {
        await Post.delete(id);
        return true;
    }
}