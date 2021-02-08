import { execSync } from "child_process"
import chalk from "chalk"
// import fs from "fs-extra"

type Env = { [key: string]: string }

const KEY_REG_EXP = /^[A-Z0-9_]+$/i

/**
 * How to run shell scripts from node
 * <https://medium.com/stackfame/how-to-run-shell-script-file-or-command-using-nodejs-b9f2455cb6b7>
 */

function convertEnvToShell(env: Env) {
  const setEntries = []
  const unsetEntries = []
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("__")) {
      throw new Error(
        `Config var keys must not start with __ ${JSON.stringify(key)}`
      )
    }
    if (key.startsWith("HEROKU_")) {
      throw new Error(
        `Config var keys must not start with HEROKU_ but is ${JSON.stringify(
          key
        )}`
      )
    }
    if (key.match(KEY_REG_EXP) == null) {
      throw new Error(
        `Config var keys must be alphanumeric and underscore only but is ${JSON.stringify(
          key
        )}`
      )
    }
    if (value.includes("'")) {
      throw new Error(
        `Config var values with a single quote not supported at the moment but is ${JSON.stringify(
          value
        )}`
      )
    }
    if (value.length > 0) {
      setEntries.push(`${key}='${value}'`)
    } else {
      unsetEntries.push(key)
    }
  }
  return {
    setEntries,
    setScriptVars: setEntries.join(" "),
    unsetEntries,
    unsetScriptVars: unsetEntries.join(" "),
  }
}

export function setHerokuEnv({ env, app }: { env: Env; app: string }) {
  console.log(chalk.keyword("lime")("Running set-heroku-env script"))
  console.log()
  console.log(chalk.keyword("lime")("Variables from dotenv file"))
  console.log(env)

  const {
    setEntries,
    setScriptVars,
    unsetEntries,
    unsetScriptVars,
  } = convertEnvToShell(env)

  const appPart = app ? `-a ${app} ` : ""

  if (setScriptVars.length > 0) {
    const setScript = `heroku config:set ${appPart}${setScriptVars}`
    console.log()
    console.log(chalk.keyword("lime")(`Executing set env script...`))
    console.log(setEntries.join("\n"))
    console.log()
    console.log(chalk.keyword("white")(setScript))
    console.log()
    execSync(setScript)
  } else {
    console.log()
    console.log(chalk.keyword("orange")("No vars to set. skipping..."))
  }
  if (unsetScriptVars.length > 0) {
    const unsetScript = `heroku config:unset ${appPart}${unsetScriptVars}`
    console.log()
    console.log(chalk.keyword("lime")(`Executing unset env script...`))
    console.log(unsetEntries.join("\n"))
    console.log()
    console.log(chalk.keyword("white")(unsetScript))
    console.log()
    execSync(unsetScript)
  } else {
    console.log()
    console.log(chalk.keyword("orange")("No vars to unset. skipping..."))
  }
  console.log()
  console.log(chalk.keyword("lime")(`Done.`))
}
