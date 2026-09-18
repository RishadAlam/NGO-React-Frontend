import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { mainMenu } from '../resources/staticData/mainMenu'

// Compare mobile discovery with the actual full-device route guards. Adding a
// route or changing its privileges automatically updates this audit's inputs.
const require = createRequire(import.meta.url)
const { parse } = createRequire(require.resolve('eslint/package.json'))('espree')
const tree = parse(readFileSync('src/App.jsx', 'utf8'), {
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: { jsx: true }
})
const name = (node) => node?.openingElement?.name?.name
const attr = (node, key) => node.openingElement.attributes.find((a) => a.name?.name === key)?.value
const descendants = (node, predicate) => {
  if (!node || typeof node !== 'object') return []
  return [
    ...(predicate(node) ? [node] : []),
    ...Object.values(node).flatMap((value) =>
      Array.isArray(value)
        ? value.flatMap((child) => descendants(child, predicate))
        : descendants(value, predicate)
    )
  ]
}
const guardedRoutes = new Map()
function walkRoute(route, base = '', inherited = []) {
  const segment = attr(route, 'path')?.value || ''
  const path =
    `${segment.startsWith('/') ? '' : base}/${segment}`.replace(/\/+/g, '/').replace(/\/$/, '') ||
    '/'
  const guard = descendants(
    attr(route, 'element'),
    (node) => name(node) === 'RequirePermissions'
  )[0]
  const permissions = guard
    ? attr(guard, 'allowedPermissions').expression.elements.map((node) => node.value)
    : null
  const groups = permissions ? [...inherited, permissions] : inherited
  if (segment) guardedRoutes.set(path, groups)
  route.children
    .filter((child) => name(child) === 'Route')
    .forEach((child) => walkRoute(child, path, groups))
}
const routes = descendants(tree, (node) => name(node) === 'Routes')[0]
routes.children.filter((child) => name(child) === 'Route').forEach((route) => walkRoute(route))
const permissions = [...new Set([...guardedRoutes.values()].flat(2))]
const visiblePaths = (granted) =>
  Object.values(mainMenu((key) => key, { mobilePermissions: granted }))
    .flat()
    .filter((item) => item.view)
    .flatMap((item) => item.subMenu || [item])
    .filter((item) => item.view && item.path)
    .map((item) => item.path)
    .sort()
const servicePaths = visiblePaths(permissions)

describe('Every mobile service matches the full-device route policy', () => {
  it('audits the complete service menu and never grants access without privileges', () => {
    expect(servicePaths.length).toBeGreaterThan(35)
    expect(new Set(servicePaths).size).toBe(servicePaths.length)
    expect(visiblePaths([])).toEqual([])
    servicePaths.forEach((path) => expect(guardedRoutes.get(path)?.length, path).toBeGreaterThan(0))
  })
  it.each(permissions)('respects the independent grant: %s', (permission) => {
    const expected = servicePaths
      .filter((path) => guardedRoutes.get(path).every((group) => group.includes(permission)))
      .sort()
    expect(visiblePaths([permission])).toEqual(expected)
  })
})
