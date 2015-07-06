import {ID, TYPE, LD} from './ld'

$(run)

function run() {
  let lang = 'sv'
  let itemId = 'http://libris.kb.se/bib/9780547928210'

  Promise.all([
    $.ajax('data/model.json', {dataType: 'json'}),
    $.ajax('data/index.jsonld', {dataType: 'json'})
  ]).then(([model, index]) => {
    let ld = new LD(model, index, {lang})
    initVue(ld, itemId)
  })
}


function initVue(ld, itemId) {
  Vue.config.debug = true

  let item = ld.index[itemId]

  let getData = () => Object.assign({ld}, {ID, TYPE})

  Vue.partial('edit-contents', '#edit-contents')
  Vue.partial('part-key', '#part-key')

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
        props: ['item']
      }
    }
  })
}
