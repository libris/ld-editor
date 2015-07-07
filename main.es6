import {ID, TYPE, LD} from './ld'

$(run)

function run() {
  let params = {}
  window.location.search.substring(1).split(/&/).forEach(pair => {
    let [k, v] = pair.split(/=/)
    if (k) params[k] = decodeURIComponent(v)
  })
  let lang = params.lang || 'en'
  let itemId = params.item

  Promise.all([
    $.ajax('data/context.jsonld', {dataType: 'json'}),
    $.ajax('data/model.jsonld', {dataType: 'json'}),
    $.ajax('data/index.jsonld', {dataType: 'json'})
  ]).then(([context, model, index]) => {
    let ld = new LD(context, model, index, {lang})
    initVue(ld, itemId)
  })
}


function initVue(ld, itemId) {
  Vue.config.debug = true

  let item = ld.index[itemId]

  let getData = () => Object.assign({ld}, {ID, TYPE})

  Vue.partial('edit-contents', '#edit-contents')
  Vue.partial('show-term', '#show-term')
  Vue.partial('show-type', '#show-type')

  window.vue = new Vue({
    el: '#editor',
    data: {item},
    methods: {
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
          show($event, id) {
            $event.preventDefault()
            alert(JSON.stringify(ld.index[id], null, 2))
          }
        }
      }
    }
  })
}
