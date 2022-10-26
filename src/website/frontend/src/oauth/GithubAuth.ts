export default function GetGitHubOAuthPath() {
  const rootURl = 'https://github.com/login/oauth/authorize';

  const options = {
    client_id: process.env.VUE_APP_GITHUB_OAUTH_CLIENT_ID as string,
    redirect_uri: process.env.VUE_APP_GITHUB_OAUTH_REDIRECT_URL as string,
    scope: 'read:user',
  };

  const qs = new URLSearchParams(options);

  return `${rootURl}?${qs.toString()}`;
}
