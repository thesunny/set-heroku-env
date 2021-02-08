# set-heroku-env

Use this script to set environment variables from a `dotenv` file to Heroku.

Create a script in `package.json` like:

```json
{
  "scripts": {
    "config:heroku": "set-heroku-env --dotenv=.env.heroku"
  }
}
```

Then run with:

```sh
# with yarn
yarn config:heroku

# with NPM
npm run config:heroku
```

To specify a specific Heroku app use `--app` otherwise it uses the default app that you set up.

```json
{
  "scripts": {
    "config:heroku": "set-heroku-env --app=heroku-app-name --dotenv=.env.heroku"
  }
}
```

## How It Works

- Sets all dotenv variables with a non-empty value on Heroku using `heroku config:set VAR1=VALUE1 VAR2=VALUE2`
- Unsets all dotenv variables with no value on Heroku using `heroku config:unset EMPTYVAR1 EMPTYVAR2`

For example:

```sh
# These will be set on Heroku
VAR1=VALUE1
VAR2=VALUE2

# These will be unset on Heroku
EMPTYVAR1=
EMPTYVAR2=
```
