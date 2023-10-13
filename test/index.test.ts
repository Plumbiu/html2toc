import { expect, test } from 'vitest'
import { html2toc } from '../src'

test('basic test', () => {
  expect(
    html2toc(`
    <h1 id="你好">hello</h1>
  `),
  ).toEqual([
    {
      level: 1,
      hash: '#你好',
      content: 'hello',
    },
  ])

  expect(
    html2toc(`
    <h1 id="你好">hello</h1>
    <div>
      <h2 id="世界">world</h2>
    </div>
    <h3 id="foo">bar</h3>
  `),
  ).toEqual([
    {
      level: 1,
      hash: '#你好',
      content: 'hello',
    },
    {
      level: 2,
      hash: '#世界',
      content: 'world',
    },
    {
      level: 3,
      hash: '#foo',
      content: 'bar',
    },
  ])
})

test('depth option', () => {
  expect(
    html2toc(
      `
    <h1 id="你好">hello</h1>
    <div>
      <h2 id="世界">world</h2>
    </div>
    <h3 id="foo">bar</h3>
  `,
      {
        depth: 1,
      },
    ),
  ).toEqual([
    {
      level: 1,
      hash: '#你好',
      content: 'hello',
    },
  ])
  expect(
    html2toc(
      `
    <h1 id="你好">hello</h1>
    <div>
      <h2 id="世界">world</h2>
    </div>
    <h3 id="foo">bar</h3>
  `,
      {
        depth: 2,
      },
    ),
  ).toEqual([
    {
      level: 1,
      hash: '#你好',
      content: 'hello',
    },
    {
      level: 2,
      hash: '#世界',
      content: 'world',
    },
  ])
})
