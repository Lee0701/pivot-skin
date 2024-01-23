
const fs = require('fs/promises')
const css = require('css')

function convertMarginPadding(declaration) {
    const type = declaration.property
    const value = declaration.value.split(' ')
    const subtypeMap = {
        'top': 'block-start',
        'bottom': 'block-end',
        'left': 'inline-start',
        'right': 'inline-end',
    }
    const subtype = type.split('-').slice(1).join('-')
    if(Object.values(subtypeMap).includes(subtype)) {
        // The subtype is already in block/inline format.
        return [declaration]
    } else if(subtypeMap[subtype]) {
        // Convert the subtype key only.
        const newType = type.split('-')[0] + '-' + subtypeMap[subtype]
        return [
            {...declaration, property: newType, value},
        ]
    } else if(value.length == 4) {
        const [top, right, bottom, left] = value
        return [
            {...declaration, property: `${type}-block-start`, value: top},
            {...declaration, property: `${type}-block-end`, value: bottom},
            {...declaration, property:`${type}-inline-start`, value: left},
            {...declaration, property:`${type}-inline-end`, value: right},
        ]
    } else if(value.length == 3) {
        const [top, inline, bottom] = value
        return [
            {...declaration, property: `${type}-block-start`, value: top},
            {...declaration, property: `${type}-block-end`, value: bottom},
            {...declaration, property: `${type}-inline`, value: inline},
        ]
    } else if(value.length == 2) {
        const [block, inline] = value
        return [
            {...declaration, property: `${type}-block`, value: block},
            {...declaration, property: `${type}-inline`, value: inline},
        ]
    } else {
        return [declaration]
    }
}

function convertWidthHeight(declaration) {
    const type = declaration.property
    const replacements = {
        'width': 'inline-size',
        'height': 'block-size',
    }
    const newType = type.split('-').map((s) => replacements[s] || s).join('-')
    return [
        {...declaration, property: newType},
    ]
}

function convertDeclarations(declarations) {
    const marginPadding = ['margin', 'padding']
    const widthHeight = ['width', 'height', 'max-width', 'max-height']
    return declarations.flatMap((declaration) => {
        if(declaration.type != 'declaration') return [declaration]
        else if(marginPadding.includes(declaration.property.split('-')[0])) return convertMarginPadding(declaration)
        else if(widthHeight.includes(declaration.property)) return convertWidthHeight(declaration)
        else return [declaration]
    })
}

function convertRules(rules) {
    return rules.map((rule) => {
        if(rule.type == 'media') return convertMedia(rule)
        else if(rule.type == 'rule') return convertRule(rule)
        else return null
    }).filter((rule) => rule)
}

function convertMedia(media) {
    const rules = convertRules(media.rules)
    return {...media, rules}
}

function convertRule(rule) {
    const declarations = convertDeclarations(rule.declarations)
    return {...rule, declarations}
}

function convertStylesheet(stylesheet) {
    const rules = convertRules(stylesheet.rules)
    return {...stylesheet, rules}
}

async function main(args) {
    const [input, output] = args
    const data = css.parse(await fs.readFile(input, 'utf8'))
    const stylesheet = convertStylesheet(data.stylesheet)
    const out = {...data, stylesheet}
    const outText = css.stringify(out).replace(/\n+/g, '\n')
    await fs.writeFile(output, outText)
}

if(require.main === module) {
    main(process.argv.slice(2))
}
