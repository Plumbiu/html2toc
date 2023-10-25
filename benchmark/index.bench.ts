import { bench } from 'vitest'
import { html2toc as html2tocV0_0_1 } from './v0.0.1'
import { html2toc as html2tocV0_0_2 } from './v0.0.2'
import { html2toc as html2tocV0_0_3 } from './v0.0.3'
import { html2toc as stringslice } from './try/string-slice'
import { html2toc } from '../src'
import { html } from './html'

bench(
  'latest',
  () => {
    html2toc(html)
  },
  {
    time: 1000,
  },
)

bench(
  'v0.0.3',
  () => {
    html2tocV0_0_3(html)
  },
  {
    time: 1000,
  },
)

bench(
  'v0.0.2',
  () => {
    html2tocV0_0_2(html)
  },
  {
    time: 1000,
  },
)

bench(
  'v0.0.1',
  () => {
    html2tocV0_0_1(html)
  },
  {
    time: 1000,
  },
)

bench(
  'stringslice',
  () => {
    stringslice(html)
  },
  {
    time: 1000,
  },
)
