import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("routes/layouts/main.tsx", [
		index("routes/index.tsx"),
		route("catalog", "routes/catalog.tsx"),
		route("auth", "routes/auth.tsx"),
		route("account", "routes/account.tsx"),
	]),
];
