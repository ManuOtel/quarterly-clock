import { mount } from 'svelte'
import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'
import './styles/utilities.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
