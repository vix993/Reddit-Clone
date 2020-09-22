import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Post } from "../entities/Post";

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

    @Mutation(() => Post, { nullable: true })
    async createPost(@Arg("title", () => String) title: string): Promise<Post> {
        //2 sql queries
        return Post.create({title}).save();
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