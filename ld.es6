export const ID = '@id',
  TYPE = '@type',
  GRAPH = '@graph',
  INDEX = '@index'

export class LD {

  constructor(model, data, {lang}={}) {
    this.model = model.index
    this.index = buildIndex(data)
    this.lang = lang
  }

  keys(o) {
    return Object.keys(o).filter(k => k[0] !== '@')
  }

  deref(ref) {
    return this.index[ref[ID]]
  }

  label(o, defaultVale='') {
    var l
    if (o.labelByLang)
      l = o.labelByLang[this.lang]
    return l || o.label || defaultVale
  }

  parts(o) {
    return this.keys(o).map(key => {
      let term = this.model[key]
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
