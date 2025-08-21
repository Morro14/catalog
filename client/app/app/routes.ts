import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("routes/Main.tsx", [
		index("routes/Index.tsx"),
		route("signup", "routes/Signup.tsx"),

		route("catalog", "routes/Catalog.tsx"),
		route("auth", "routes/Auth.tsx"),
		route("account", "routes/Account.tsx"),
		route("password-reset", "routes/PassReset.tsx"),
	]),
] satisfies RouteConfig;
// export default [index("routes/TestRoute.tsx")] satisfies RouteConfig;
