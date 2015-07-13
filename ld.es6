export const BASE = '@base',
  CONTAINER = '@container',
  CONTEXT = '@context',
  GRAPH = '@graph',
  ID = '@id',
  INDEX = '@index',
  LANGUAGE = '@language',
  LIST = '@list',
  SET = '@set',
  TYPE = '@type',
  VALUE = '@value',
  VOCAB = '@vocab'

export class LD {

  constructor(context, model, data, {lang}={}) {
    this.context = context[CONTEXT]
    this.model = buildIndex(model)
    this.index = buildIndex(data)
    this.lang = lang
  }

  keys(o) {
    return Object.keys(o).filter(k => k[0] !== '@')
  }

  deref(ref) {
    return this.index[ref[ID]] || ref
  }

  expand(key) {
    return key
  }

  label(o, defaultValue='', leadingUpperCase=false) {
    if (!o) {
      let dfn = this.context[defaultValue]
      if (dfn) {
        o = this.model[dfn[ID]]
      }
    }
    defaultValue = defaultValue || o[ID]
    if (o) {
      let value = (this.lang && o.labelByLang && o.labelByLang[this.lang]) ||
        o.prefLabel ||
        o.title ||
        o.name ||
        o.notation ||
        o.label ||
        pick(o, 'qualifiedTitle', 'title')
      if (value) {
        if (leadingUpperCase) {
          value = value[0].toUpperCase() + value.substring(1)
        }
        return value
      }
    }
    return defaultValue
  }

  parts(o) {
    return this.keys(o).map(key => {
      let term = this.model[this.expand(key)]
      let value = o[key]
      let kind = classify(value)
      if (kind.array) {
        value = value.map(it => Object.assign({value: it}, classify(it)))
      }
      return Object.assign({term, key, value}, kind)
    })
  }

}

function buildIndex(data, indexKey=ID) {
  if (typeof data.forEach !== 'function') {
    data = data[GRAPH]
  }
  let index = {}
  for (let item of data) {
    index[item[indexKey]] = item
  }
  return index
}

export function classify(o) {
  let jsobject = typeof o === 'object'
  let literal = !jsobject
  let array = o.constructor === Array
  let object = jsobject && !array
  let keys = Object.keys(o)
  let ref = object && keys.length === 1 && keys[0] === ID
  let node = object && !ref
  let bnode = node && typeof o[ID] === 'undefined'
  return {literal, array, ref, node, bnode}
}

export function pick(o, key, subkey) {
  let part = o[key]
  if (part) {
    if (part instanceof Array) {
      part = part[0]
    }
    let value = part[subkey]
    return value
  }
}
