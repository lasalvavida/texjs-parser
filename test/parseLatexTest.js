import {expect} from 'chai'
import parseLatex from '../lib/parseLatex'

describe('parseLatex', function () {
  it('can parse a latex command', function () {
    var environment = parseLatex('\\documentclass[12pt]{article}')
    expect(environment).to.deep.equal([
      {
        name: 'documentclass',
        type: 'command',
        arguments: [
          {
            value: '12pt',
            optional: true
          }, {
            value: 'article',
            optional: false
          }
        ]
      }
    ])
  })

  it('can parse two latex commands', function () {
    var environment = parseLatex('\\documentclass[12pt]{article}\n' +
      '\\usepackage{amsmath}')
    expect(environment).to.deep.equal([
      {
        name: 'documentclass',
        type: 'command',
        arguments: [
          {
            value: '12pt',
            optional: true
          }, {
            value: 'article',
            optional: false
          }
        ]
      }, {
        name: 'usepackage',
        type: 'command',
        arguments: [
          {
            value: 'amsmath',
            optional: false
          }
        ]
      }
    ])
  })

  it('can parse latex commands with text', function () {
    var environment = parseLatex('\\maketitle\n' +
      '\\LaTeX{} was originally written in 1984 by Leslie Lamport and has become the dominant method for using \\TeX; ' +
      'few people write in plain \\TeX{} anymore.')
    expect(environment).to.deep.equal([
      {
        name: 'maketitle',
        type: 'command',
        arguments: []
      }, {
        name: 'LaTeX',
        type: 'command',
        arguments: [
          {
            value: '',
            optional: false
          }
        ]
      },
      ' was originally written in 1984 by Leslie Lamport and has become the dominant method for using ', {
        name: 'TeX',
        type: 'command',
        arguments: []
      },
      '; few people write in plain ', {
        name: 'TeX',
        type: 'command',
        arguments: [
          {
            value: '',
            optional: false
          }
        ]
      },
      ' anymore.'
    ])
  })

  it('can parse nested commands', function () {
    var environment = parseLatex('\\title{\\LaTeX}')
    expect(environment).to.deep.equal([
      {
        name: 'title',
        type: 'command',
        arguments: [
          {
            value: [
              {
                name: 'LaTeX',
                type: 'command',
                arguments: []
              }
            ],
            optional: false
          }
        ]
      }
    ])
  })

  it('can parse environments', function () {
    var environment = parseLatex('\\begin{document}\n' +
        '    The current version is \\LaTeXe.' +
        '\\end{document}'
    )
    expect(environment).to.deep.equal([
      {
        name: 'document',
        type: 'environment',
        arguments: [],
        children: [
          'The current version is ', {
            name: 'LaTeXe',
            type: 'command',
            arguments: []
          },
          '.'
        ]
      }
    ])
  })

  it('can parse nested environments', function () {
    var environment = parseLatex('\\begin{document}\n' +
        '  \\begin{align}\n' +
        '    E_0 &= mc^2\n' +
        '    \\\\\n' +
        '    E &= \\frac{mc^2}{\\sqrt{1 - \\frac{v^2}{c^2}}}\n' +
        '  \\end{align}\n' +
        '\\end{document}')
    expect(environment).to.deep.equal([
      {
        name: 'document',
        type: 'environment',
        arguments: [],
        children: [
          {
            name: 'align',
            type: 'environment',
            arguments: [],
            children: [
              'E_0 &= mc^2\\\\E &= ', {
                name: 'frac',
                type: 'command',
                arguments: [
                  {
                    value: 'mc^2',
                    optional: false
                  }, {
                    value: [
                      {
                        name: 'sqrt',
                        type: 'command',
                        arguments: [
                          {
                            value: [
                              '1 - ', {
                                name: 'frac',
                                type: 'command',
                                arguments: [
                                  {
                                    value: 'v^2',
                                    optional: false
                                  }, {
                                    value: 'c^2',
                                    optional: false
                                  }
                                ]
                              }
                            ],
                            optional: false
                          }
                        ]
                      }
                    ],
                    optional: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ])
  })
})
