function parseEnvironment(latex, offset, name, environment) {
  var mode = 'text'
  var j;
  var next;

  var args = []
  var arg = ''
  var command = ''
  var text = ''

  for (var i = offset; i < latex.length; i++) {
    var c = latex.charAt(i)
    if (mode === 'command') {
      if (c === '{') {
        mode = 'arg'
        continue
      }
    } else if (mode === 'arg') {
      if (c === '}') {
        args.push(arg)
        j = i
        next = latex.charAt(j)
        while (next === ' ' && j < latex.length) {
          j++
          next = latex.charAt(j)
          if (next === '\n') {
            break
          }
        }
        if (next === '{') {
          mode = ''
          i = j
          continue
        } else {
          command = command.trim()
          if (command === 'begin') {

          } else if (command === 'end') {
            if (args[0] === name) {
               
            }
          }
        }
      }
    } else if (mode === 'text'){
      if (c === '\\') {
        next = latex.charAt(i + 1)
        if (next !== '\\') {
          next = latex.charAt(i + 2)
          if (next !== ' ') {
            mode = 'command'
            continue
          }
        }
      }
    }
    if (mode === 'text') {
      text += c
    } else if (mode === 'command') {
      command += c
    } else if (mode === 'arg') {
      arg += c
    }
  }
}


function parseLatex(latex) {
  var json = []
  var mode = 'text'

  var arg = ''
  var command = ''
  var text = ''

  for (var i = 0; i < latex.length; i++) {




  }
}

export default parseLatex
