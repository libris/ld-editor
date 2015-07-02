const ID = '@id',
  TYPE = '@type'

$(run)

function run() {

  $.ajax('data/index.jsonld', {dataType: 'json'}).done(data => {
    let index = buildIndex(data)
    initVue(index)
  })

}

function buildIndex(data) {
  let index = {}
  for (let item of data) {
    index[item[ID]] = item
  }
  return index
}


function initVue(index) {

  let editId = 'http://libris.kb.se/bib/9780547928210'
  let item = index[editId]

  window.vue = new Vue({
    el: '#editor',
    data: {ID, TYPE, index, item},
    methods: {
    }
  })
}

Vue.component('edit-event', {
  inherit: true,
  template: '#edit-event',
  props: ['event']
})

Vue.component('edit-work', {
  inherit: true,
  template: '#edit-work',
  props: ['work']
})

Vue.component('edit-product', {
  inherit: true,
  template: '#edit-product',
  props: ['product']
})
