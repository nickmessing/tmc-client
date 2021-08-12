/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as t from '@babel/types'
import * as babel from '@babel/core'
import generate from '@babel/generator'
import mkdirp from 'mkdirp'
import { notEmpty } from '../src/utils/common'

const code = readFileSync('src/api/generated/openapi.ts', { encoding: 'utf-8' })

const ast = babel.parse(code, {
  plugins: [require('@babel/plugin-syntax-typescript').default],
  filename: 'openapi.ts',
}) as t.File

const program = ast.program
const body = program.body

const processPaths = async (body: t.TSTypeElement[]) => {
  const methods = body
    .map(typeElement => {
      if (!t.isTSPropertySignature(typeElement)) {
        return null
      }

      const { key, typeAnnotation } = typeElement

      if (!t.isStringLiteral(key)) {
        return null
      }

      const path = key.value

      if (!t.isTSTypeAnnotation(typeAnnotation)) {
        return null
      }

      const subTypeAnnotation = typeAnnotation.typeAnnotation

      if (!t.isTSTypeLiteral(subTypeAnnotation)) {
        return null
      }

      const { members } = subTypeAnnotation

      return members
        .map(member => {
          if (!t.isTSPropertySignature(member)) {
            return null
          }

          const { key, typeAnnotation } = member

          if (!t.isIdentifier(key)) {
            return null
          }

          const httpMethod = key.name

          if (!t.isTSTypeAnnotation(typeAnnotation)) {
            return null
          }

          const subTypeAnnotation = typeAnnotation.typeAnnotation

          if (!t.isTSIndexedAccessType(subTypeAnnotation)) {
            return null
          }

          const { indexType } = subTypeAnnotation

          if (!t.isTSLiteralType(indexType)) {
            return null
          }

          const { literal } = indexType

          if (!t.isStringLiteral(literal)) {
            return null
          }

          const [controller, controllerMethod] = literal.value.split('_')

          return {
            path,
            httpMethod,
            controller,
            controllerMethod,
          }
        })
        .filter(notEmpty)
    })
    .filter(notEmpty)
    .flat()
    .reduce<Record<string, { path: string; httpMethod: string; controller: string; controllerMethod: string }[]>>(
      (obj, descriptor) => ({
        ...obj,
        [descriptor.controller]: [...(obj[descriptor.controller] ?? []), descriptor],
      }),
      {},
    )

  const controllersDir = join(__dirname, '..', 'src', 'api', 'generated', 'controllers')

  await mkdirp(controllersDir)

  for (const key in methods) {
    writeFileSync(
      join(controllersDir, `${key}.ts`),
      generate(
        t.program([
          t.importDeclaration(
            [t.importSpecifier(t.identifier('request'), t.identifier('request'))],
            t.stringLiteral('../../api'),
          ),
          ...methods[key].map(method =>
            t.exportNamedDeclaration(
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(method.controllerMethod),
                  t.callExpression(t.identifier('request'), [
                    t.stringLiteral(method.path),
                    t.stringLiteral(method.httpMethod),
                  ]),
                ),
              ]),
            ),
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ]) as any,
      ).code,
      { encoding: 'utf-8' },
    )
  }
}

const processComponentsSchemas = async (members: t.TSTypeElement[]) => {
  const enumsDir = join(__dirname, '..', 'src', 'api', 'generated', 'enums')
  await mkdirp(enumsDir)

  members.map(member => {
    if (!t.isTSPropertySignature(member)) {
      return null
    }

    const { key, typeAnnotation } = member

    if (!t.isIdentifier(key)) {
      return null
    }

    if (!t.isTSTypeAnnotation(typeAnnotation)) {
      return null
    }

    const subTypeAnnotation = typeAnnotation.typeAnnotation

    if (!t.isTSUnionType(subTypeAnnotation)) {
      return null
    }

    const { types } = subTypeAnnotation

    if (!types.every(type => t.isTSLiteralType(type) && t.isStringLiteral(type.literal))) {
      return null
    }

    const values = (types as t.TSLiteralType[]).map(type => (type.literal as t.StringLiteral).value)

    const typedId = t.identifier(key.name)
    typedId.typeAnnotation = t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('Record'),
        t.tsTypeParameterInstantiation([
          t.tsTypeReference(t.identifier(key.name)),
          t.tsTypeReference(t.identifier(key.name)),
        ]),
      ),
    )

    writeFileSync(
      join(enumsDir, `${key.name}.ts`),
      generate(
        t.program([
          t.exportNamedDeclaration(
            t.tsTypeAliasDeclaration(
              t.identifier(key.name),
              null,
              t.tsUnionType(values.map(value => t.tsLiteralType(t.stringLiteral(value)))),
            ),
          ),
          t.exportNamedDeclaration(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                typedId,
                t.objectExpression(values.map(value => t.objectProperty(t.identifier(value), t.stringLiteral(value)))),
              ),
            ]),
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ]) as any,
      ).code,
      { encoding: 'utf-8' },
    )
  })
}

const processComponents = (body: t.TSTypeElement[]) => {
  body.map(typeElement => {
    if (!t.isTSPropertySignature(typeElement)) {
      return null
    }

    const { key, typeAnnotation } = typeElement

    if (!t.isIdentifier(key)) {
      return null
    }

    if (key.name !== 'schemas') {
      return null
    }

    if (!t.isTSTypeAnnotation(typeAnnotation)) {
      return null
    }

    const subTypeAnnotation = typeAnnotation.typeAnnotation

    if (!t.isTSTypeLiteral(subTypeAnnotation)) {
      return null
    }

    processComponentsSchemas(subTypeAnnotation.members)
  })
}

body.map(statement => {
  if (!t.isExportNamedDeclaration(statement)) {
    return null
  }

  if (statement.exportKind !== 'type') {
    return null
  }

  const { declaration } = statement

  if (!t.isTSInterfaceDeclaration(declaration)) {
    return null
  }

  const { id } = declaration

  const { name } = id

  if (name === 'paths') {
    processPaths(declaration.body.body)
  }
  if (name === 'components') {
    processComponents(declaration.body.body)
  }
})
