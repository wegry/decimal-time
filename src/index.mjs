import { render } from 'preact'
import { html } from 'htm/preact'

import { App } from './components/app.mjs'

import './global.css'

render(html`<${App} />`, document.querySelector('.display'))
