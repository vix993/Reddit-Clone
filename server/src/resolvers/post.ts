import { MyContext } from "../types";
import { Resolver, Query, Arg, Mutation, Field, InputType, Ctx, UseMiddleware, Int, FieldResolver, Root } from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
// import { User } from "src/entities/User";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(@Root() root: Post) {
       const isTruncated = root.text.length > 150;
       return isTruncated ? `${root.text.slice(0,150)}...` : root.text;
    }

    @Query(() => [Post])
    async posts(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit);
        const qb = getConnection()
            .getRepository(Post)
            .createQueryBuilder("p")
            .orderBy('"createdAt"', "DESC")
            .take(realLimit);

            if (cursor) {
                qb.where('"createdAt" < :cursor', {
                    cursor: new Date(parseInt(cursor)),
                });
            }

            return qb.getMany();
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