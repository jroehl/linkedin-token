const rp = require('request-promise-native');
const app = require('express')();
const { urls, api } = require('./config');
const { parseSeconds } = require('./utils');

module.exports = (log, timeout) => (flags, resolve, reject) => {
  const { callback_path, client_id, client_secret, redirect_uri, port } = flags;

  app.get(`/${callback_path}`, async (req, res, next) => {
    clearTimeout(timeout);
    log('Callback triggered');

    if (!req.query.code) throw new Error('Authorization failed');

    try {
      const authUrl = `${urls.base}${urls.accessToken}`;
      log(`Fetching auth url "${authUrl}"`);
      const auth = await rp(authUrl, {
        json: true,
        qs: {
          grant_type: 'authorization_code',
          client_id,
          client_secret,
          redirect_uri,
          ...req.query,
        },
      });

      const { access_token, expires_in } = auth;

      const meUrl = `${api.base}${api.me}`;
      log(`Fetching me api endpoint "${meUrl}"`);
      const user = await rp(meUrl, { json: true, headers: { Authorization: `Bearer ${access_token}` } });
      const { lastName, firstName } = user;
      const localized = `${lastName.preferredLocale.language}_${lastName.preferredLocale.country}`;
      const name = `${firstName.localized[localized]} ${lastName.localized[localized]}`;

      const values = [
        {
          key: 'authorized_user',
          value: `${name} (${localized})`,
        },
        {
          key: 'access_token (click to copy to clipboard)',
          value: access_token,
          attrs: `onClick="copyStringToClipboard('${access_token}')" style="cursor: pointer;"`,
        },
        {
          key: 'expires_in',
          value: `${expires_in} (${parseSeconds(expires_in)})`,
        },
      ];

      res.status(200).send(`
        <section style="font-family: monospace;">
          ${values.map(({ key, value, attrs = '' }) => `<div ${attrs}><h3>${key}</h3><p>${value}</p></div>`).join('\n')}
        </section>
        <script>
          function copyStringToClipboard(str) {
            var el = document.createElement('textarea');
            console.log(el);
            el.value = str;
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
          }
          console.log(${JSON.stringify({ user, auth })});
        </script>
      `);
      next();
      resolve({ user, auth, values });
    } catch (e) {
      next(e);
    }
  });

  app.use((err, req, res, next) => {
    res.status(500).send(err.stack);
    reject(err);
  });

  app.listen(port, err => {
    if (err) return reject(err);
    if (flags.verbose) log(`Express server listening at http://localhost:${port}`);
  });
};
