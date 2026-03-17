import { classifyAction } from "../runtime/actions/index.mjs"

export function handleActionSubcommand(args) {
  const result = classifyAction(parsedInput)
  console.log(JSON.stringify(result, null, 2))
}