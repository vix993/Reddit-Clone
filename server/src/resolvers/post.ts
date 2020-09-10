import { Resolver, Query, Ctx, Arg, Int } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Ctx() {em}: MyContext
    ): Promise<Post[]> {
        return em.find(Post, {});
    }
    @Query(() => Post, { nullable: true })
    post(
        @Arg('id', () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        return em.findOne(Post, { id });
    }
}