/** @format */

import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
const main = async () => {
	const orm = await MikroORM.init(microConfig);

	//Create express server
	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		context: () => ({ em: orm.em }),
	});
	//Apply the middleware before sending the request to the server
	apolloServer.applyMiddleware({ app });

	app.get("/", (_, res) => {
		res.send("hello");
	});
	app.listen(4000, () => {
		console.log("server started on localhost:4000");
	});
};
main().catch((error) => {
	console.error(error);
});
