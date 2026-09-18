import fs from 'node:fs'
import process from 'node:process'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

// Reuse the parser provided by the project's existing ESLint installation.
const require = createRequire(import.meta.url)
const eslintRequire = createRequire(require.resolve('eslint'))
const { parse } = eslintRequire('espree')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function flattenCatalog(value, prefix = '') {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      return typeof entry === 'object' && entry !== null
        ? Object.entries(flattenCatalog(entry, fullKey))
        : [[fullKey, entry]]
    })
  )
}

export function auditSource(source, file = 'source.jsx') {
  const ast = parse(source, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    loc: true
  })
  const references = []
  const literals = []
  const dynamic = []
  const readable = (value) => typeof value === 'string' && /\p{L}/u.test(value)
  const literal = (node) =>
    node?.type === 'Literal'
      ? node.value
      : node?.type === 'TemplateLiteral' && !node.expressions.length
        ? node.quasis[0].value.cooked
        : undefined
  function finiteKeys(node) {
    const value = literal(node)
    if (typeof value === 'string') return [value]
    if (node?.type === 'ConditionalExpression') {
      const yes = finiteKeys(node.consequent)
      const no = finiteKeys(node.alternate)
      return yes && no ? [...yes, ...no] : null
    }
    if (node?.type === 'TemplateLiteral') {
      let values = [node.quasis[0].value.cooked]
      for (let index = 0; index < node.expressions.length; index++) {
        const choices = finiteKeys(node.expressions[index])
        if (!choices) return null
        values = values.flatMap((prefix) =>
          choices.map((choice) => prefix + choice + node.quasis[index + 1].value.cooked)
        )
      }
      return values
    }
    return null
  }
  function walk(node, parent) {
    if (!node || typeof node !== 'object') return
    const visibleValues = (expression, kind) => {
      const values =
        finiteKeys(expression) ||
        (expression?.type === 'LogicalExpression' ? finiteKeys(expression.right) : null)
      for (const text of values || []) {
        if (readable(text)) literals.push({ file, line: node.loc.start.line, text, kind })
      }
    }
    if (
      node.type === 'JSXExpressionContainer' &&
      ['JSXElement', 'JSXFragment'].includes(parent?.type)
    ) {
      visibleValues(node.expression, 'expression')
    }
    if (node.type === 'Property' && node.key?.name === 'Header')
      visibleValues(node.value, 'table header')
    if (
      node.type === 'CallExpression' &&
      node.callee?.object?.name === 'toast' &&
      ['error', 'success', 'loading'].includes(node.callee.property?.name)
    ) {
      visibleValues(node.arguments[0], 'notification')
    }
    if (
      node.type === 'CallExpression' &&
      (node.callee?.name === 't' || node.callee?.property?.name === 't')
    ) {
      const keys = finiteKeys(node.arguments[0])
      const record = { file, line: node.loc.start.line }
      if (keys) references.push(...keys.map((key) => ({ ...record, key })))
      else
        dynamic.push({
          ...record,
          expression: source.slice(node.arguments[0]?.start, node.arguments[0]?.end)
        })
    }
    if (node.type === 'JSXText' && readable(node.value.trim())) {
      literals.push({
        file,
        line: node.loc.start.line,
        text: node.value.replace(/\s+/g, ' ').trim(),
        kind: 'text'
      })
    }
    if (node.type === 'JSXAttribute') {
      const key = node.name.name
      const tag = parent?.name?.name || ''
      if (key === 'pageTitle') {
        const value = literal(node.value) ?? literal(node.value?.expression)
        if (typeof value === 'string')
          references.push({ file, line: node.loc.start.line, key: value })
      }
      if (
        [
          'title',
          'label',
          'placeholder',
          'aria-label',
          'alt',
          'noOptionsText',
          'loadingText',
          'helperText'
        ].includes(key) ||
        (key === 'name' && /Btn|Button/.test(tag))
      ) {
        const value = literal(node.value) ?? literal(node.value?.expression)
        if (readable(value))
          literals.push({ file, line: node.loc.start.line, text: value, kind: key })
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (['loc', 'range', 'tokens', 'comments'].includes(key)) continue
      if (Array.isArray(child)) child.forEach((entry) => walk(entry, node))
      else if (child && typeof child === 'object') walk(child, node)
    }
  }
  walk(ast)
  return { references, literals, dynamic }
}

export function auditProject(projectRoot = root) {
  const result = { files: 0, references: [], literals: [], dynamic: [] }
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'test' || entry.name === 'icons') continue
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) visit(filename)
      else if (/\.(js|jsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
        const audit = auditSource(
          fs.readFileSync(filename, 'utf8'),
          path.relative(projectRoot, filename)
        )
        result.files++
        for (const kind of ['references', 'literals', 'dynamic']) result[kind].push(...audit[kind])
      }
    }
  }
  visit(path.join(projectRoot, 'src'))
  return result
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const audit = auditProject()
  const catalogs = Object.fromEntries(
    ['en', 'bn'].map((language) => [
      language,
      flattenCatalog(
        JSON.parse(
          fs.readFileSync(path.join(root, `public/lang/${language}/translations.json`), 'utf8')
        )
      )
    ])
  )
  const missing = audit.references.filter(
    ({ key }) => !(key in catalogs.en) || !(key in catalogs.bn)
  )
  const parity = [...new Set([...Object.keys(catalogs.en), ...Object.keys(catalogs.bn)])].filter(
    (key) => !(key in catalogs.en) || !(key in catalogs.bn)
  )
  console.log(
    JSON.stringify(
      {
        files: audit.files,
        referencedKeys: new Set(audit.references.map(({ key }) => key)).size,
        missing,
        parity,
        literals: audit.literals,
        ...(process.argv.includes('--dynamic') ? { dynamic: audit.dynamic } : {})
      },
      null,
      2
    )
  )
  process.exitCode = missing.length || parity.length ? 1 : 0
}
