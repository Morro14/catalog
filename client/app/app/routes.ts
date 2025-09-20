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

			route("catalog", "routes/Catalog.tsx", [
				route("", "routes/CatalogIndex.tsx"),
				route(":entryId", "routes/CatalogEntry.tsx"),
			]),

			// layout("test-catalog", [route("test-catalog/:entry", "routes/TestEntry.tsx"), route("test")]),
			// route("test-catalog", "routes/TestCatalog.tsx", [
			// 	route(":entryId", "routes/TestEntry.tsx"),
			// ]),

			// layout("routes/TestCatalog.tsx", [
			// 	route("test-catalog", "routes/TestTree.tsx"),
			// 	route("test-catalog/:entryId", "routes/TestEntry.tsx"),
			// ]),

			route("password-reset", "routes/PassReset.tsx"),
			route("oauth-success", "routes/OauthSuccess.tsx"),
		]),
	]),
] satisfies RouteConfig;
