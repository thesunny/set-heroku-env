import { execSync } from "child_process"
import chalk from "chalk"
// import fs from "fs-extra"

type Env = { [key: string]: string }

const KEY_REG_EXP = /^[A-Z_]+$/i

/**
 * How to run shell scripts from node
 * <https://medium.com/stackfame/how-to-run-shell-script-file-or-command-using-nodejs-b9f2455cb6b7>
 */

function convertEnvToShell(env: Env) {
  const setEntries = []
  const unsetEntries = []
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith("__")) {
      throw new Error(`Config var keys must not start with __`)
    }
    if (key.startsWith("HEROKU_")) {
      throw new Error(`Config var keys must not start with HEROKU_`)
    }
    if (key.match(KEY_REG_EXP) == null) {
      throw new Error(
        `Config var keys must be alphanumeric and underscore only`
      )
    }
    if (value.includes("'")) {
      throw new Error(
        `Config var values with a single quote not supported at the moment`
      )
    }
    if (value.length > 0) {
      setEntries.push(`${key}='${value}'`)
    } else {
      unsetEntries.push(key)
    }
  }
  return {
    setScriptVars: setEntries.join(" "),
    unsetScriptVars: unsetEntries.join(" "),
  }
}

export function setHerokuEnv({ env, app }: { env: Env; app: string }) {
  console.log(chalk.keyword("lime")("Running set-heroku-env script"))
  console.log()
  console.log(chalk.keyword("lime")("Variables from dotenv file"))
  console.log(env)

  const { setScriptVars, unsetScriptVars } = convertEnvToShell(env)

  if (setScriptVars.length > 0) {
    const setScript = `heroku config:set -a ${app} ${setScriptVars}`
    console.log()
    console.log(chalk.keyword("lime")(`Executing set env script...`))
    console.log(chalk.keyword("white")(setScript))
    execSync(setScript)
  } else {
    console.log()
    console.log(chalk.keyword("orange")("No vars to set. skipping..."))
  }
  if (unsetScriptVars.length > 0) {
    const unsetScript = `heroku config:unset -a ${app} ${unsetScriptVars}`
    console.log()
    console.log(chalk.keyword("lime")(`Executing unset env script...`))
    console.log(chalk.keyword("white")(unsetScript))
    execSync(unsetScript)
  } else {
    console.log()
    console.log(chalk.keyword("orange")("No vars to unset. skipping..."))
  }
}
