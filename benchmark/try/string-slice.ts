interface Html2TocOpts {
  depth: number
}

interface Toc {
  level: number
  content: string
  hash: string
}

// use string slice, but it is slower than RegExp
export function html2toc(
  html: string,
  options: Html2TocOpts = {
    depth: 3,
  },
) {
  const { depth } = options
  let pos = 0
  const toc: Toc[] = []
  while ((pos = html.indexOf('<h', pos)) !== -1) {
    pos = pos + 2
    const level = +html[pos]
    if (level > depth) {
      continue
    }
    const idStart = html.indexOf(`id="`, pos)
    const idEnd = html.indexOf(`"`, idStart + 4)
    const id = html.slice(idStart + 4, idEnd)
    const content = html.slice(
      html.indexOf('>', idEnd) + 1,
      (pos = html.indexOf('</', idEnd)),
    )
    toc.push({
      level,
      hash: '#' + id,
      content,
    })
  }
  html.slice(pos + 2)
  return toc
}
