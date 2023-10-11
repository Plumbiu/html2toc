# html2toc

Part of [@plumbiu/md](https://github.com/Plumbiu/md).

# Usage

```ts
/*
  function html2Toc(html: string, options?: {
    depth: number
  }): {
    level: number
    content: string
    hash: string
  }[]
*/

import { md2html } from '@plumbiu/md'

await md2toc('<h1 id="hello-world">hello world</h1>', {
  // depth mean the toc depth
  depth: 3 // 3 by default
})

/*
  [
    { level: 1, content: 'hello world', hash: 'hello-world' }
  ]
*/
```
