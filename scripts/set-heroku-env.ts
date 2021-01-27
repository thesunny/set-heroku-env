import minimist from "minimist"
import dotenv from "dotenv"
import { setHerokuEnv } from "~/lib/set-heroku-env"
import chalk from "chalk"

const args = minimist(process.argv)

if (typeof args.dotenv !== "string") {
  console.log(chalk.keyword("crimson")("Missing command line argument"))
  console.log(
    chalk.keyword("crimson")(`--dotenv=path-to-dotenv is a required argument`)
  )
  process.exit()
}

const env = dotenv.config({ path: args.dotenv }).parsed

if (env == null) {
  console.log(
    chalk.keyword("crimson")("dotenv not found or could not be parsed")
  )
  console.log(
    chalk.keyword("crimson")(
      `Could not find or parse dotenv file "${args.dotenv}"`
    )
  )
  process.exit()
}

setHerokuEnv({ env, app: "set-heroku-env" })
