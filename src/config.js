module.exports = {
  urls: {
    base: 'https://www.linkedin.com',
    apps: '/developers/apps',
    accessToken: '/oauth/v2/accessToken',
    authorization: '/oauth/v2/authorization',
  },
  api: {
    base: 'https://api.linkedin.com/v2',
    me: '/me',
  },
  defaults: {
    port: 3000,
    callbackPath: 'callback',
    scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
  },
};
