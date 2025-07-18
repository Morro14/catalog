import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("routes/layouts/Main.tsx", [
		index("routes/Index.tsx"),
		route("catalog", "routes/Catalog.tsx"),
		route("auth", "routes/Auth.tsx"),
		route("account", "routes/Account.tsx"),
		route("password-recover/:jwt", "routes/PassRecover.tsx")
	]),
] satisfies RouteConfig;
