import {ID, TYPE, LD} from './ld'

$(run)

function run() {

  $.ajax('data/index.jsonld', {dataType: 'json'}).done(data => {
    let ld = new LD({}, data)
    initVue(ld)
  })

}


function initVue(ld) {
  Vue.config.debug = true

  let editId = 'http://libris.kb.se/bib/9780547928210'
  let item = ld.index[editId]

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
