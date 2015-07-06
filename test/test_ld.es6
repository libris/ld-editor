import test from 'tape'
import {classify} from '../ld'

test('Should classify values', t => {
  let c = classify({"@id": '/', label: "thing"})
  t.ok(c.node)
  t.notOk(c.bnode)
  t.end()
})
