//
// Alba - javascript autocomplete tool written on top of jQuery 2
//
// Author: Zhomart Mukhamejanov, 2015
//

var Alba = function(input_selector){
  this.input_selector = input_selector

  this.results_selector = '.group-users-search-results'

  this.results = []

  this.initialize()
  this.initResults()
}

Alba.prototype.initialize = function() {
  this.initListeners()
};

Alba.prototype.initResults = function() {
  $(this.results_selector).hide()
}

Alba.prototype.showResults = function(results) {
  this.results = results
  this.elements = {}

  $input = $(this.input_selector)

  $resultsHTML = $(this.results_selector)

  $content = $resultsHTML.find('.group-users-search-results-content')
  $content.html('')
  $resultsHTML.show()

  if (typeof(this.results) == "string"){
    $content.append($('<li>', { html: this.results, class: 'loading' }))
  } else {
    for (var i in this.results){
      var r = this.results[i]

      this.elements[r.id] = r

      var $li = $('<li>', { 'data-user-id': r.id })
      $li.append($('<div>', { html: r.email, class: 'email' }))
      $li.append($('<div>', { html: r.name, class: 'name' }))
      $content.append($li)
    }
  }

  var input_offset = $input.offset()
  var input_height = $input.outerHeight()

  $resultsHTML.offset({
    left: input_offset.left,
    top: input_offset.top + input_height
  })
}

Alba.prototype.hideResults = function() {
  $resultsHTML = $(this.results_selector)
  $resultsHTML.hide()
}

Alba.prototype.search = function(q){
  var alba = this

  $(alba.input_selector).data('selected-user-id', null)

  if (q.length){
    $.get('/users/search', { q: q }, function(e){
      if (e.users && e.users.length > 0)
        alba.showResults(e.users)
      else
        alba.showResults("Not found")
    })
  } else {
    alba.showResults("Begin typing to search for a user")
  }
}

Alba.prototype.initListeners = function() {
  var alba = this

  alba.showResults("Loading...")

  $(this.input_selector).on('keyup', function(e){
    alba.search($(this).val())
  })

  $(document).on('click', function(e){
    alba.hideResults()
  })

  $(this.input_selector).on('click', function(e){
    e.stopPropagation()
  })

  $(this.results_selector).on('click', function(e){
    e.stopPropagation()
  })

  $(this.input_selector).on('focus', function(){
    alba.search($(this).val())
  })

  $(this.results_selector).on('click', 'li', function(e){
    var userId = $(this).data('user-id')
    $(alba.input_selector).val(alba.elements[userId].name)
    $(alba.input_selector).data('selected-user-id', userId)
    alba.hideResults()
  })
};
