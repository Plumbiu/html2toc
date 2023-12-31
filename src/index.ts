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
  const HLABEL = new RegExp(`<h[${levelDep}]`, 'g')
  const toc: Toc[] = []
  let m: RegExpExecArray | null
  while ((m = HLABEL.exec(html))) {
    const idx = m.index
    const idLoc = html.indexOf('id', idx) + 4
    const id = html.slice(idLoc, html.indexOf('"', idLoc))
    const content = html.slice(
      html.indexOf('>', idLoc) + 1,
      html.indexOf('</', idLoc),
    )
    toc.push({
      level: +m[0][2],
      hash: '#' + id,
      content,
    })
  }
  return toc
}
