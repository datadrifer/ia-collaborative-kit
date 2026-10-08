#!/usr/bin/env node
// Re-creates the IA Collaborative Design System page in the signed-in Claude account.
// Claude runs the three steps; the Artifact tool does the uploads and the publish.
//
//   node publish-page.mjs prepare            copy the page to a work folder; print the upload calls
//   node publish-page.mjs record <work> --from <results.json>
//                                            [{ "path": "<group>/<name>", "url": "/_blob/<id>" }]
//   node publish-page.mjs finish <work> [--existing <design-system.json read from the new page>]
//                                            swap in the new file ids; print the final publish
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'design-system-page')
const [command, workArg] = process.argv.slice(2)
const flag = (name) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const print = (data) => console.log(JSON.stringify(data, null, 2))
const TEXT = /\.(md|json|html|css|js|ts|txt)$/i

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function prepare() {
  const page = readJson(join(SOURCE, 'page.json'))
  // Inside the folder Claude runs in: the Artifact tool uploads and publishes only from there.
  const work = resolve(flag('work') ?? join(process.cwd(), `ia-design-page-${page.version}`))
  rmSync(work, { recursive: true, force: true })
  mkdirSync(dirname(work), { recursive: true })
  cpSync(SOURCE, work, { recursive: true })

  // Images, SVG and PDF go up to 25 a call; a Markdown or JSON file goes in a call of its own.
  const media = page.assets.filter((a) => !/\.(md|json)$/i.test(a.name))
  const text = page.assets.filter((a) => /\.(md|json)$/i.test(a.name))
  const fileOf = (a) => join(work, 'assets', a.group, a.name)
  const calls = []
  for (let i = 0; i < media.length; i += 25) {
    const batch = media.slice(i, i + 25)
    calls.push({ file_paths: batch.map(fileOf), paths: batch.map((a) => `${a.group}/${a.name}`) })
  }
  for (const a of text) calls.push({ file_path: fileOf(a), paths: [`${a.group}/${a.name}`] })

  print({
    work,
    title: page.title,
    version: page.version,
    uploads: calls,
    then: `node publish-page.mjs record "${work}" --from <a JSON list of { "path": "<group>/<name>", "url": "<the url the upload returned>" }>`,
  })
}

function record(work) {
  const rows = readJson(flag('from'))
  const path = join(work, 'uploads.json')
  const uploads = existsSync(path) ? readJson(path) : {}
  const bad = []
  for (const row of rows) {
    const id = String(row.url ?? row.id ?? '').replace(/^.*\/_blob\//, '')
    if (!/^[0-9a-f]{16,64}$/.test(id) || !/^[^/]+\/[^/]+$/.test(String(row.path))) {
      bad.push(row.path ?? '?')
      continue
    }
    uploads[row.path] = id
  }
  writeFileSync(path, `${JSON.stringify(uploads, null, 2)}\n`)
  print({ recorded: rows.length - bad.length, total: Object.keys(uploads).length, notRecorded: bad })
  if (bad.length) process.exitCode = 1
}

function finish(work) {
  const page = readJson(join(work, 'page.json'))
  const uploads = existsSync(join(work, 'uploads.json')) ? readJson(join(work, 'uploads.json')) : {}
  const missing = page.assets.filter((a) => !uploads[`${a.group}/${a.name}`]).map((a) => `${a.group}/${a.name}`)
  if (missing.length) {
    print({ error: 'upload these first, then record them', missing })
    process.exitCode = 1
    return
  }

  // Every old file id in the page's text files becomes the new one.
  const swap = new Map(page.assets.map((a) => [a.blob, uploads[`${a.group}/${a.name}`]]))
  const project = join(work, 'project')
  for (const file of walk(project).filter((f) => TEXT.test(f))) {
    let body = readFileSync(file, 'utf8')
    for (const [oldId, newId] of swap) body = body.replaceAll(oldId, newId)
    writeFileSync(file, body)
  }

  // The index: the new page's own marker and keys stay; the system's groups, files and docs come from the kit.
  const ours = readJson(join(project, 'design-system.json'))
  const existingPath = flag('existing')
  const existing = existingPath && existsSync(existingPath) ? readJson(existingPath) : null
  const valid = existing && existing.v === 3 && (existing.createdOnFiles || existing.convertedFrom)
  const index = {
    ...(valid ? existing : ours),
    title: flag('title') ?? ours.title,
    namespace: ours.namespace,
    libraries: ours.libraries,
    groups: ours.groups,
    assetGroups: ours.assetGroups,
    docs: ours.docs,
    lastChange: { by: 'Claude', at: new Date().toISOString(), via: 'IA design plugin', note: `${ours.title} ${page.version}` },
  }
  writeFileSync(join(project, 'design-system.json'), `${JSON.stringify(index, null, 2)}\n`)

  // The Artifact tool's `files` map: published path → source path under root (types go as plain text).
  const files = Object.fromEntries(
    walk(project)
      .map((f) => relative(work, f))
      .filter((f) => f !== join('project', 'design-system.json'))
      .map((f) => [f, f.endsWith('.d.ts') ? { from: f, contentType: 'text/plain' } : f]),
  )
  print({
    publish: {
      root: work,
      file_path: join(project, 'design-system.json'),
      files,
    },
    note: 'One Artifact publish with the page url, this root, this file_path and these files.',
  })
}

if (command === 'prepare') prepare()
else if (command === 'record' && workArg) record(resolve(workArg))
else if (command === 'finish' && workArg) finish(resolve(workArg))
else {
  console.error('usage: publish-page.mjs prepare | record <work> --from <results.json> | finish <work> [--existing <file>] [--title <title>]')
  process.exitCode = 2
}
