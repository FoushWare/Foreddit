/** @format */

import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Posts";
import microConfig from "./mikro-orm.config";
const main = async () => {
	const orm = await MikroORM.init(microConfig);

	//Create post
	const post = orm.em.create(Post, { title: "my first post" });
	// Run the migration automatic
	await orm.getMigrator().up();
	//insert post to the DB
	await orm.em.persistAndFlush(post);
	const allPosts = await orm.em.find(Post, {});
	console.log(allPosts);
};
main().catch((error) => {
	console.error(error);
});
