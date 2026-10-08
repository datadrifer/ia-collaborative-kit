#!/usr/bin/env node
// Sets up the IA Collaborative design system in the current project:
// copies the system into .claude/skills/, checks it is intact, switches on the gate,
// and adds a short "Design system" note to CLAUDE.md. Safe to run again (it updates).
import { spawnSync } from 'node:child_process'
import { appendFileSync, cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SLUG = 'ia-collaborative-design-system'
const source = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills', SLUG)
const project = resolve(process.argv[2] ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd())
const target = join(project, '.claude', 'skills', SLUG)

const NOTE = `
## Design system

Style only from the IA Collaborative design system (\`.claude/skills/${SLUG}/SKILL.md\`).
Every value is a token. Read the skill before any visual work.
`

function run(script, args = []) {
  const result = spawnSync(process.execPath, [join(target, 'gate', script), ...args], { cwd: project, encoding: 'utf8' })
  // The delivery adds a few files the manifest does not list; their "extra" notes are expected.
  const quiet = (text) => (text ?? '').split('\n').filter((line) => !line.startsWith('extra ')).join('\n')
  process.stdout.write(quiet(result.stdout))
  process.stderr.write(quiet(result.stderr))
  return result.status === 0
}

function main() {
  if (!existsSync(join(source, 'SKILL.md'))) {
    console.error(`setup: the design system is missing from the plugin (${source}). Reinstall the plugin.`)
    return 1
  }
  if (existsSync(target)) rmSync(target, { recursive: true, force: true })
  cpSync(source, target, { recursive: true })
  console.log(`setup: copied the design system to ${target}`)

  if (!run('check.mjs', ['--verify'])) {
    console.error('setup: the copied folder does not match its manifest. Reinstall the plugin and run setup again.')
    return 1
  }
  if (!run('enable-hook.mjs', ['--project', project])) {
    console.error('setup: could not switch on the gate. See the message above.')
    return 1
  }

  const claudeMd = join(project, 'CLAUDE.md')
  const current = existsSync(claudeMd) ? readFileSync(claudeMd, 'utf8') : ''
  if (!current.includes(`.claude/skills/${SLUG}/SKILL.md`)) {
    appendFileSync(claudeMd, NOTE)
    console.log('setup: added a Design system note to CLAUDE.md')
  }
  console.log('setup: done. Restart Claude Code in this project so the gate loads.')
  return 0
}

process.exitCode = main()
