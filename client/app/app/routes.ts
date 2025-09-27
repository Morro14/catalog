import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("main.tsx", [
		layout("routes/Main.tsx", [
			index("routes/Index.tsx"),
			route("signup", "routes/Signup.tsx"),

			route("catalog", "routes/Catalog.tsx"),

			route("password-reset", "routes/PassReset.tsx"),
			route("oauth-success", "routes/OauthSuccess.tsx"),
		]),
	]),
] satisfies RouteConfig;
