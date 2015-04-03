$(function(){

  $('.js-add-activity').on('click', function(e){
    e.preventDefault()

    var group_id = $('#activity_group_id').val()

    var activity = {
      title: $('#activity_title').val(),
      cost: $('#activity_cost').val()
    }

    var url = "/groups/add_activity/" + group_id

    $('.js-add-activity-modal-error').hide()

    $.post(url, activity, function(e){
      if (e.errors){
        $('.js-add-activity-modal-error').html(e.errors).show()
      } else {
        location.reload()
      }
    })
  })

  if ($('.js-group-users-add').length){
    // look at public/javascripts/alba.js
    new Alba('.js-group-users-search-input')

    $('.js-group-users-add').on('click', function(){
      var groupId = $('.js-group-users-search-input').data('group-id')
      var userId = $('.js-group-users-search-input').data('selected-user-id')

      if (userId){
        var url = "/groups/add_user/" + groupId
        $.post(url, { userId: userId }, function(e){
          if (e.errors){
            alert(e.errors)
          } else {
            location.reload()
          }
        })
      } else {
        alert("Please select user")
      }
    })
  }

})
