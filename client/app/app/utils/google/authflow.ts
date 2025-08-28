const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function startGoogleAuthFlow() {
	const redirectUri = SERVER_URL + "/auth/google/callback";
	console.log(redirectUri);
	const scope =
		"openid email profile https://www.googleapis.com/auth/drive.readonly";
	const responseType = "code";

	const oauthUrl =
		`https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${GOOGLE_CLIENT_ID}` +
		`&redirect_uri=${encodeURIComponent(redirectUri)}` +
		`&response_type=${responseType}` +
		`&scope=${encodeURIComponent(scope)}` +
		`&access_type=offline` +
		`&prompt=consent`;
	window.location.href = oauthUrl;
}
