grammar DiyReact;

program: statement+;

statement: importStatement | exportStatement | functionDeclaration | variableDeclaration | returnStatement | callFunction;

// import * from 'react';
// import { Component } from 'react';
// import React from 'react';
importStatement: 'import' (importAll | importNamed | importDefault) 'from' STRING_LITERAL ';';

// * as React
importAll: '*' 'as' IDENTIFIER;

// { Component, PropTypes }
importNamed: '{' IDENTIFIER (',' IDENTIFIER)* '}';

// React
importDefault: IDENTIFIER;

// export (default) function Foo() {} | export (default) const foo = 1;
exportStatement: 'export' 'default'? (functionDeclaration | variableDeclaration);

// function App() {}
functionDeclaration: 'function' IDENTIFIER '(' (IDENTIFIER (',' IDENTIFIER)*)? ')' '{' statement '}';

// (const | var | let)  App = () => {};
variableDeclaration: ('const' | 'var' | 'let') IDENTIFIER ('=' literals | jsxExpression | operation | statement)?;

// literals: 1 | 'foo' | true | false | null | undefined
literals: NUMBER_LITERAL | STRING_LITERAL | BOOLEAN_LITERAL | NULL_LITERAL | UNDEFINED_LITERAL;

// <div>jsExpression</div>
jsxExpression: '<' IDENTIFIER '>' (jsxExpression | literals | operation | statement)* '</' IDENTIFIER '>';

// 1 + 1
operation: literals (OPERATOR literals)*;

// return 1;
returnStatement: 'return' expression | callFunction | IDENTIFIER;

// App(); | App(1, 2); | foo.bar(); | foo.bar(1, 2);
callFunction: (IDENTIFIER '.')? IDENTIFIER '(' (IDENTIFIER (',' IDENTIFIER)*)? ')';

// 1 or operation
expression: jsxExpression | operation;

IDENTIFIER: [a-zA-Z_$][a-zA-Z0-9_$]*;
NUMBER_LITERAL: [0-9]+;
STRING_LITERAL: '"' (.)*? '"';
BOOLEAN_LITERAL: 'true' | 'false';
NULL_LITERAL: 'null';
UNDEFINED_LITERAL: 'undefined';
OPERATOR: '+' | '-' | '*' | '/' | '%';
fragment WS: [ \t\r\n]+ -> skip ;

//with all the above rules, we can parse the following code
//import React from 'react';
//import { Component } from 'react';
//import * as DiyReact from 'react';
//
//export default function App() {
//  return <div>hello world</div>;
//}

