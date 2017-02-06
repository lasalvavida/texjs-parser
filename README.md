# texjs-parser
Node.js parser for TeX strings to create a formatted JSON hierarchy.

### What this does
This is a parser that converts a valid TeX string into
a more usable data structure for use in applications. 
It even supports nested environments and commands nested inside arguments.

### What this does not do
All this does is read formatted TeX and produce a hierarchy. If your TeX is invalid,
this may produce unexpected output/crash. It also is not concerned with whether or not
your commands or environments exist; that is the job of a higher level application layer.


## Usage

### Get texjs-parser 
```
npm install texjs-parser --save
```

### Parse a TeX string
```javascript
import parseTex from 'texjs-parser'

var tex = '\\begin{document}\n' +
  '    text\n' + 
  '    \\textbf{bold text}\n' +
  '\\end{document}'
  
var environment = parseTex(tex)
```

```json
[
  {
    "name": "document",
    "type": "environment",
    "arguments": [],
    "children": [
      "text", 
      {
        "name": "textbf",
        "type": "command",
        "arguments": [
          "bold text"
        ]
      }
    ]
  }
]
```

## Issues
I'm sure there are edge cases of valid TeX where this doesn't 
produce the expected output. If you find one, please open an issue, 
and if you're so inclined, open a pull request with a fix 
and a new test.


