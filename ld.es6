export const ID = '@id',
  TYPE = '@type'

export class LD {

  constructor(model, data) {
    this.model = model
    this.index = buildIndex(data)
  }

  keys(o) {
    return Object.keys(o).filter(k => k[0] !== '@')
  }

  deref(ref) {
    return this.index[ref[ID]]
  }

  label(o) {
    return o.label
  }

  parts(o) {
    return this.keys(o).map(key => {
      let value = o[key]
      return Object.assign({key, value}, classify(value))
    })
  }

}

function buildIndex(data) {
  let index = {}
  for (let item of data) {
    index[item[ID]] = item
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
