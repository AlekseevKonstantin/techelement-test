var brackets = [
  {
    type: 'round',
    count: 1,
    inner: [
      {
        type: 'braces',
        count: 1
      }
    ]
  },
  {
    type: 'braces',
    count: 1
  },
  {
    type: 'round',
    count: 2
  }
]

var brackets1 = [
  {
    type: 'round',
    count: 1
  },
  {
    type: 'round',
    count: 1
  },
  {
    type: 'round',
    count: 1
  }
]

var brackets2 = [
  {
    type: 'round',
    count: 1
  },
  {
    type: 'braces',
    count: 1
  },
  {
    type: 'square',
    count: 1
  }
]

var brackets3 = [
  {
    type: 'round',
    count: 1,
    inner: [
      {
        type: 'braces',
        count: 1,
        inner: [
          {
            type: 'round',
            count: 1
          },
          {
            type: 'square',
            count: 1 
          },
          {
            type: 'round',
            count: 1,
            inner: [
              {
                type: 'braces',
                count: 2
              },
              {
                type: 'square',
                count: 1
              }
            ]
          }  
        ]
      }
    ]
  },
  {
    type: 'braces',
    count: 1
  },
  {
    type: 'round',
    count: 2,
    inner: [
      {
        type: 'square',
        count: 1
      },
      {
        type: 'square',
        count: 1
      }
    ]
  }
]

function getBracketsExpr (brackets) {

  var openBrackets = {
    round: '(',
    braces: '{',
    square: '['
  }

  var closeBrackets = {
    round: ')',
    braces: '}',
    square: ']'
  }

  var result = [];

  for (var j = 0, len = brackets.length; j < len; j+=1) {
    
    var count = 0,
        inner = null;

    if (openBrackets[brackets[j].type]) {
      count = brackets[j].count;
      inner = brackets[j].inner;

      for (var i = 0; i < count; i+=1) {
        result.push(openBrackets[brackets[j].type])
      }

      if (inner) {
        var innerBrackets = getBracketsExpr(inner);
        result = result.concat(innerBrackets);
      }
    }

    for (var i = 0; i < count; i+=1) {
      result.push(closeBrackets[brackets[j].type])
    }

  }

  return result;
}

function bracketsExprToStr (brackets) {
  return getBracketsExpr(brackets).join('');
}

/* test */

console.log( bracketsExprToStr (brackets) );
console.log( bracketsExprToStr (brackets1) );
console.log( bracketsExprToStr (brackets2) );
console.log( bracketsExprToStr (brackets3) );


function checkPairsBrackets(str) {
  var openBrackets = ['(', '{', '['],
      closeBrackets = [')', '}', ']'],
      stack = [];

  for (var i = 0, len = str.length; i < len; i+=1) {

    var index = openBrackets.indexOf(str[i])

    if (index > -1) {
      stack.push(index)
    }else { 
      var closeIndex = closeBrackets.indexOf(str[i]); 
      if (closeIndex > -1) {
        if (stack.length === 0) return false;
        var stackIndex = stack.pop();
        if (stackIndex !== closeIndex) {
          return false;
        }
      }
    }
  }

  return stack.length === 0;
}

/* test */

console.log(checkPairsBrackets('()([])([]})'));
console.log(checkPairsBrackets('()([])({[]})'));
console.log(checkPairsBrackets('(())'));
console.log(checkPairsBrackets('(())({})'));
console.log(checkPairsBrackets('())({})'));
console.log(checkPairsBrackets('[(])')); 