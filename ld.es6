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
    this.context = context
    this.model = buildIndex(model)
    this.index = buildIndex(data)
    this.lang = lang
  }

  keys(o) {
    return Object.keys(o).filter(k => k[0] !== '@')
  }

  deref(ref) {
    return this.index[ref[ID]]
  }

  expand(key) {
    return key
  }

  label(o, defaultVale='') {
    return (!o && defaultVale) ||
            (o.labelByLang && o.labelByLang[this.lang]) ||
            o.prefLabel ||
            o.title ||
            o.name ||
            o.label ||
            defaultVale
  }

  parts(o) {
    return this.keys(o).map(key => {
      let term = this.model[this.expand(key)]
      let value = o[key]
      return Object.assign({term, key, value}, classify(value))
    })
  }

}

function buildIndex(data, indexKey=ID) {
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
