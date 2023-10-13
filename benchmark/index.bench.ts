import { bench } from 'vitest'
import { html2toc as html2tocV0_0_1 } from './v0.0.1'
import { html2toc as html2tocV0_0_2 } from './v0.0.2'
import { html2toc } from '../src'
import { html } from './html'

bench(
  'v0.0.1',
  () => {
    html2tocV0_0_1(html)
  },
  {
    time: 10,
  },
)

bench(
  'v0.0.2',
  () => {
    html2tocV0_0_2(html)
  },
  {
    time: 10,
  },
)

bench(
  'vlatest',
  () => {
    html2toc(html)
  },
  {
    time: 10,
  },
)
