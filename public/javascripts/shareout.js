$(function(){

  //
  // It adds confirmation to the elements
  //
  // Usage
  //
  //   <a href="/delete" data-confirm="Are you sure?">Delete</a>
  //
  $('[data-confirm]').on('click', function(e){
    if (!confirm($(this).data('confirm'))){
      e.preventDefault()
      return false
    }
    return true
  })

})
