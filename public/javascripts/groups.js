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

})