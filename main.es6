import {ID, TYPE, LD} from './ld'

$(run)

function run() {
  let params = {}
  window.location.search.substring(1).split(/&/).forEach(pair => {
    let [k, v] = pair.split(/=/)
    if (k) params[k] = decodeURIComponent(v)
  })
  let lang = params.lang
  let editId = params.item

  Promise.all([
    $.ajax('data/context.jsonld', {dataType: 'json'}),
    $.ajax('data/model.jsonld', {dataType: 'json'}),
    $.ajax('data/index.jsonld', {dataType: 'json'})
  ]).then(([context, model, index]) => {
    let ld = new LD(context, model, index, {lang})
    initVue(ld, editId)
  })
}


function initVue(ld, editId) {
  Vue.config.debug = true

  let item = ld.index[editId]

  let getData = () => Object.assign({ld}, {ID, TYPE})

  Vue.partial('edit-contents', '#edit-contents')
  Vue.partial('show-term', '#show-term')
  Vue.partial('show-type', '#show-type')

  window.vue = new Vue({
    el: '#editor',
    data: {ld, item, editId},
    methods: {
      thingOptGroups() {
        let optGroups = {}
        for (let it of Object.values(ld.index)) {
          let type = it[TYPE]
          if (!type)
            continue
          let optGroup = optGroups[type]
          if (!optGroup) {
            optGroup = optGroups[type] = {label: type, options: []}
          }
          optGroup.options.push({text: ld.label(it), value: it[ID]})
        }
        return Object.values(optGroups)
      },
      edit(id) {
        this.$data.item = ld.index[id]
      },
      save() {
        let item = this.$data.item
        let repr = JSON.stringify(item, null, 2)
        alert(repr)
      }
    },
    components: {
      'edit-node': {
        template: '#edit-node',
        data: getData,
        props: ['item', 'type']
      },
      'edit-bnode': {
        template: '#edit-bnode',
        data: getData,
        props: ['item']
      },
      'edit-ref': {
        template: '#edit-ref',
        data: getData,
        props: ['item'],
        methods: {
          show($event, ref) {
            $event.preventDefault()
            let id = ref[ID]
            let thing = ld.index[id]
            if (!thing)
              return
            for (let key of Object.keys(thing)) {
              ref.$set(key, thing[key])
            }
          }
        }
      }
    }
  })
}
