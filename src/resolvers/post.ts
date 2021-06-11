/** @format */

import { Post } from "../entities/Posts";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
	//--------- Get all posts ------------------
	@Query(() => [Post])
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}
	//---------- Get specific post by id ---------
	@Query(() => Post, { nullable: true })
	post(@Ctx() { em }: MyContext, @Arg("id") id: number): Promise<Post | null> {
		return em.findOne(Post, { id });
	}
	//--------- Create new Post --------------------
	@Mutation(() => Post)
	async createPost(
		@Ctx() { em }: MyContext,
		@Arg("title") title: string
	): Promise<Post> {
		const post = em.create(Post, { title });
		await em.persistAndFlush(post);
		return post;
	}
	//--------------Update Existing Post
	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Ctx() { em }: MyContext,
		@Arg("id") id: number,
		@Arg("title", () => String, { nullable: true }) title: string
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return null;
		}
		if (typeof title !== "undefined") {
			post.title = title;
			await em.persistAndFlush(post);
		}
		return post;
	}
	//------------- Remove Post ----------------
	@Mutation(() => Boolean)
	async deletePost(
		@Ctx() { em }: MyContext,
		@Arg("id") id: number
	): Promise<boolean> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return false;
		}
		await em.nativeDelete(Post, { id });
		return true;
	}
}
