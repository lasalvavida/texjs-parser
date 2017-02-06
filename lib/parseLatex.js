function emptyArray(array) {
  while(array.length > 0) {
    array.pop()
  }
}

const invalidNameCharacters = {
  ';': true,
  '\\': true,
  '.': true
}

function parseCommand(latex, offset, environment) {
  var buildName = []
  var buildArg = []
  var args = []

  var possiblyEnding = false
  var argHasCommand = false
  var mode = 'name'
  var i
  var openBraces = 0
  var openBrackets = 0

  for (i = offset; i < latex.length; i++) {
    var c = latex.charAt(i)
    if (mode !== 'arg' && (c === '{' || c === '[')) {
      mode = 'arg'
    } else if ((c === '}' || c === ']') && openBraces === 0 && openBrackets === 0) {
      var argValue
      var stringArg = buildArg.join('')
      stringArg = stringArg.trim()
      if (argHasCommand) {
        argValue = []
        parseEnvironment(stringArg, 0, argValue)
      } else {
        argValue = stringArg
      }
      var arg = {
        value: argValue,
        optional: false
      }
      if (c === ']') {
        arg.optional = true
      }
      args.push(arg)
      emptyArray(buildArg)
      mode = 'nextArg'
      possiblyEnding = true
      argHasCommand = false
    } else {
      if (mode === 'name' || mode === 'nextArg') {
        if (invalidNameCharacters[c] || (possiblyEnding && (c === ' ' || c === '\n'))) {
          i--
          break
        }
        if (c === ' ' || c === '\n') {
          possiblyEnding = true
          continue
        }
      }
      if (mode === 'name') {
        buildName.push(c)
      } else if (mode === 'arg') {
        if (c === '\\' && latex.charAt(i + 1) !== '\\') {
          argHasCommand = true
        } else if (c === '{') {
          openBraces++
        } else if (c === '}') {
          openBraces--
        } else if (c === '[') {
          openBrackets++
        } else if (c === ']') {
          openBrackets--
        }
        buildArg.push(c)
      }
    }
  }
  var name = buildName.join('').trim()
  if (name === 'begin') {
    var children = []
    name = ''
    for (var j = 0; j < args.length; j++) {
      var argument = args[j]
      if (!argument.optional) {
        name = argument.value
        args.splice(j, 1)
        break
      }
    }
    environment.push({
      name: name,
      type: 'environment',
      arguments: args,
      children: children
    })
    i = parseEnvironment(latex, i + 1, children)
  } else if (name !== 'end') {
    environment.push({
      name: name,
      type: 'command',
      arguments: args
    })
  }

  return i
}

function parseEnvironment(latex, offset, environment) {
  var buildText = []
  var i
  for (i = offset; i < latex.length; i++) {
    var c = latex.charAt(i)
    if (c === '\n') {
      if (latex.charAt(i + 1) === '\n') {
        if (buildText.length > 0) {
          environment.push(buildText.join(''))
          emptyArray(buildText)
        }
        i++
      }
    } else if (c === '\\') {
      i++
      if (latex.charAt(i) !== '\\') {
        if (buildText.length > 0) {
          environment.push(buildText.join(''))
          emptyArray(buildText)
        }
        i = parseCommand(latex, i, environment)
      } else {
        buildText.push('\\\\')
      }
    } else {
      buildText.push(c)
    }
  }
  if (buildText.length > 0) {
    environment.push(buildText.join(''))
  }
  return i
}


function parseLatex(latex) {
  var environment = []
  latex = latex.replace(/\n( )+/g, '\n')
  latex = latex.replace(/ +/g, ' ')
  parseEnvironment(latex, 0, environment)
  return environment
}

export default parseLatex
