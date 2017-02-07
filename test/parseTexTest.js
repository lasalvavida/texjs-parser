import {expect} from 'chai'
import parseTex from '../lib/parseTex'

describe('parseTex', function () {
  it('can parse a latex command', function () {
    var environment = parseTex('\\documentclass[12pt]{article}')
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
    var environment = parseTex('\\documentclass[12pt]{article}\n' +
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
    var environment = parseTex('\\maketitle\n' +
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
    var environment = parseTex('\\title{\\LaTeX}')
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
    var environment = parseTex('\\begin{document}\n' +
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
    var environment = parseTex('\\begin{document}\n' +
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

  it('separates commands into environments properly', function () {
    var environment = parseTex('\\begin{document}\n' +
      '\\section{one}\n' +
      '\\begin{math}\n' +
      'x = \\frac{a}{b+1}\n' +
      '\\end{math}\n' +
      '\\section{two}\n' +
      '\\end{document}')
    expect(environment).to.deep.equal([
      {
        name: 'document',
        type: 'environment',
        arguments: [],
        children: [
          {
            name: 'section',
            type: 'command',
            arguments: [
              {
                value: 'one',
                optional: false
              }
            ]
          }, {
            name: 'math',
            type: 'environment',
            arguments: [],
            children: [
              'x = ',
              {
                name: 'frac',
                type: 'command',
                arguments: [
                  {
                    value: 'a',
                    optional: false
                  }, {
                    value: 'b+1',
                    optional: false
                  }
                ]
              }
            ]
          }, {
            name: 'section',
            type: 'command',
            arguments: [
              {
                value: 'two',
                optional: false
              }
            ]
          }
        ]
      }
    ])
  })

  it('ends commands at invalid name characters', function() {
    var environment = parseTex('\\alpha_2^2')
    expect(environment).to.deep.equal([
      {
        name: 'alpha',
        type: 'command',
        arguments: []
      },
      '_2^2'
    ])
  })

  it('doesn\t grab spaces after command without arguments', function() {
    var environment = parseTex('\\begin{math}\n' +
      '\\Rightarrow x\n' +
      '\\end{math}')
    expect(environment).to.deep.equal([
      {
        name: 'math',
        type: 'environment',
        arguments: [],
        children: [
          {
            name: 'Rightarrow',
            type: 'command',
            arguments: []
          },
          'x'
        ]
      }
    ])
  })
})
