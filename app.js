// #!/usr/bin/env node
'use strict';

import importJsx from 'import-jsx'
import {
	h, render
} from 'ink'
import meow from 'meow'
import UI from './ui'

const app = meow(`
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

render(h(UI, app.flags));
