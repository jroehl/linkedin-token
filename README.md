# linkedin-token

A small helper tool to create oauth2 token for linkedin api v2

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/linkedin-token.svg)](https://npmjs.org/package/linkedin-token)
[![Downloads/week](https://img.shields.io/npm/dw/linkedin-token.svg)](https://npmjs.org/package/linkedin-token)
[![License](https://img.shields.io/npm/l/linkedin-token.svg)](https://github.com/jroehl/linkedin-token/blob/master/package.json)

# Usage and commands

`npx linkedin-token --help`

```bash
linkendin-token cli

USAGE
  $ linkedin-token

OPTIONS
  -S, --scope=scope                  [default: r_liteprofile,r_emailaddress,w_member_social] scope of the permissions
  -V, --version                      show CLI version
  -c, --callback_path=callback_path  [default: callback] path of the temporary server callback url
  -h, --help                         show CLI help
  -i, --client_id=client_id          (required) client id of the linkedin app
  -p, --port=port                    [default: 3000] port of the temporary server and callback url
  -s, --client_secret=client_secret  (required) client secret of the linkedin app
  -v, --verbose

DESCRIPTION
  Use this cli to generate a oauth2 access token for the linkedin api v2. You need to have an app set up (https://www.linkedin.com/developers/apps)
```

## Create access token

`npx linkedin-token --client_id=<client_id> --client_secret=<client_secret>`
