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
  const ID = /id=["'](.*)["']/
  const CONTENT = />(.*)</
  const toc: Toc[] = []
  let m: RegExpExecArray | null
  while ((m = HLABEL.exec(html))) {
    const h = m[0]
    const id = ID.exec(h)?.[1]
    const content = CONTENT.exec(h)?.[1] ?? ''
    toc.push({
      level: Number(h[2]),
      hash: '#' + id,
      content,
    })
  }
  return toc
}
