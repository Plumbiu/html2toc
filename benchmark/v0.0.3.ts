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
  const HLABEL = new RegExp(
    `<(h[${levelDep}])((?!</h[${levelDep}]).)*</\\1>`,
    'g',
  )
  const toc: Toc[] = []
  let m: RegExpExecArray | null
  while ((m = HLABEL.exec(html))) {
    const h = m[0]
    const idLoc = h.indexOf('id=') + 4
    const id = h.slice(idLoc, h.indexOf('"', idLoc))
    const content = h.slice(h.indexOf('>') + 1, h.indexOf('</'))
    toc.push({
      level: Number(h[2]),
      hash: '#' + id,
      content,
    })
  }
  return toc
}
