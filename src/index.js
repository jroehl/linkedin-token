const qs = require('querystring');
const { Command, flags } = require('@oclif/command');
const open = require('open');
const clipboardy = require('clipboardy');

const { defaults, urls } = require('./config');
const server = require('./server');
const { logger } = require('./utils');

const run = (self, flags) => {
  const { callback_path, port, scope, client_id } = flags;
  const redirect_uri = `http://localhost:${port}/${callback_path}`;
  const log = logger(flags.verbose);

  server(log, setTimeout(() => self.error('Command timeout', { exit: 1 }), 15000))(
    {
      ...flags,
      redirect_uri,
    },
    res => {
      log(res);
      self.log('');
      const { values, auth } = res;
      res.values.forEach(({ key, value }) => {
        self.log(key);
        self.log(value);
        self.log('');
      });
      clipboardy.writeSync(auth.access_token);
      process.exit(0);
    },
    err => self.error(err.message || err, { exit: 1 })
  );

  queryParams = qs.stringify({
    response_type: 'code',
    scope: scope.join(' '),
    state: '123456',
    client_id,
    redirect_uri,
  });

  const url = `${urls.base}${urls.authorization}?${queryParams}`;
  log(`Open auth url "${url}"`);
  open(url);
};

class LinkedinTokenCommand extends Command {
  async run() {
    const { flags } = this.parse(LinkedinTokenCommand);
    run(this, flags);
  }
}

LinkedinTokenCommand.description = `linkendin-token cli

Use this cli to generate a oauth2 access token for the linkedin api v2. You need to have an app set up (${urls.base}${urls.apps})`;

LinkedinTokenCommand.flags = {
  version: flags.version({ char: 'V' }),
  verbose: flags.boolean({ char: 'v' }),
  help: flags.help({ char: 'h' }),
  client_id: flags.string({ char: 'i', description: 'client id of the linkedin app', required: true }),
  client_secret: flags.string({ char: 's', description: 'client secret of the linkedin app', required: true }),
  scope: flags.string({ char: 'S', description: 'scope of the permissions', default: defaults.scope, multiple: true }),
  port: flags.string({ char: 'p', description: 'port of the temporary server and callback url', default: defaults.port }),
  callback_path: flags.string({ char: 'c', description: 'path of the temporary server callback url', default: defaults.callbackPath }),
};

module.exports = LinkedinTokenCommand;
