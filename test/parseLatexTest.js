import assert from 'assert'
import parseLatex from '../lib/parseLatex'

describe('parseLatex', function () {
  it('can parse a simple latex document', function () {
    var latex = '' +
      '\\documentclass[12pt]{article}\n' +
      '\\usepackage{amsmath}\n' +
      '\\title{\\LaTeX}\n' +
      '\\date{}\n' +
      '\\begin{document}\n' +
      '  \\maketitle\n' +
      '  \\LaTeX{} is a document preparation system for\n' +
      '  the \\TeX{} typesetting program. It offers\n' +
      '  programmable desktop publishing features and\n' +
      '  extensive facilities for automating most\n' +
      '  aspects of typesetting and desktop publishing,\n' +
      '  including numbering and  cross-referencing,\n' +
      '  tables and figures, page layout,\n' +
      '  bibliographies, and much more. \\LaTeX{} was\n' +
      '  originally written in 1984 by Leslie Lamport\n' +
      '  and has become the  dominant method for using\n' +
      '  \\TeX; few people write in plain \\TeX{} anymore.\n' +
      '  The current version is \\LaTeXe.\n' +
      '  \n' +
      '  % This is a comment, not shown in final output.\n' +
      '  % The following shows typesetting  power of LaTeX:\n' +
      '  \\begin{align}\n' +
      '    E_0 &= mc^2                              \\\\\n' +
      '    E &= \\frac{mc^2}{\\sqrt{1-\\frac{v^2}{c^2}}}\n' +
      '  \\end{align}\n' +
      '\\end{document}\n'
    var environment = parseLatex(latex)
    expect(environment).toEqual({
      name: 'documentclass',
      type: 'command',
      arguments: [
        {
          value: '12pt',
          type: 'optional'
        },
        {
          value: 'article',
          type: 'required'
        }
      ],
    }, {
      name: 'usepackage',
      type: 'command',
      arguments: [
        {
          value: 'amsmath',
          type: 'required'
        }
      ]
    }, {
      name: 'title',
      type: 'command',
      arguments: [
        {
          value: {
            name: 'LaTeX'.
            type: 'command',
            arguments: []
          },
          type: 'required'
        }
      ]
    }, {
      name: 'date',
      type: 'command',
      arguments: []
    }, {
      name: 'document',
      type: 'environment',
      arguments: [],
      children: [
        {
          name: 'maketitle',
          type: 'command',
          arguments: []
        }, {
          name: 'LaTeX',
          type: 'command',
          arguments: []
        },
        ' is a document preparation system for\n'
      ]
    })
  })
})
