interface Html2TocOpts {
  depth: number
}

interface Toc {
  level: number
  content: string
  hash: string
}

export function html2toc(
  html: string,
  options: Html2TocOpts = {
    depth: 3,
  },
) {
  const { depth } = options
  let levelDep = ''
  for (let i = 1; i <= depth; i++) {
    levelDep += i
  }
  const HLABEL = new RegExp(`<h[${levelDep}][\\w\\W]+>[\\w\\W]+`)
  const ID = /id=["']([\w\W]+)["']/
  const tocs: Toc[] = []
  const tokens = html.split(new RegExp(`</h[${levelDep}]`))

  for (const token of tokens) {
    const h = HLABEL.exec(token)?.[0]
    if (h) {
      const level = Number(h[2])
      const hash = '#' + (ID.exec(h)?.[1] ?? '')
      const content = h.slice(h.lastIndexOf('>') + 1)
      tocs.push({
        level,
        hash,
        content,
      })
    }
  }

  return tocs
}
