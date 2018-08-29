#!/usr/bin/env node
'use strict';

const importJsx = require('import-jsx');
const {h, render} = require('ink');
const meow = require('meow');

const Ui = importJsx('./ui');

const cli = meow(`
	Usage
	  $ rouboworks [input]

	Options
	  --name  Lorem ipsum [Default: false]

	Examples
	  $ rouboworks
	  I love Ink
	  $ rouboworks --name=ponies
	  I love ponies
`);

render(h(Ui, cli.flags));
