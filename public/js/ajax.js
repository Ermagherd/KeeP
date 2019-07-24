"use strict";

$( document ).ready(function() {

  // * USER POST
  $("#post-submit").click(function(e){

    e.preventDefault();
    var text = $("#user-post").val();
    $("#user-post").val("");

    console.log(text);

      // $.ajax({
      //   url: "test.html",
      //   context: document.body
      // }).done(function() {
      //   $( this ).addClass( "done" );
      // });

  });

  // * USER SEARCH
  function fetchUsers () {
    sessionStorage.clear();
    if ( sessionStorage.users == undefined ) {
      console.log('enter conditon');

      function GetString() {
        var keyValue = "";
        $.ajax({
            async: false,
            type: "GET",
            url: "/profile/all-users",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
              let arrayReturn = [];
              response.forEach(element => {
                arrayReturn.push(element.username);
              });
              keyValue = arrayReturn;
              sessionStorage.setItem('users', JSON.stringify(arrayReturn));
            },
            failure: function (response) {
                console.log("wrong response from database call");
            }
        });
        return keyValue;
      }
      var search = GetString();
      console.log('var search : ' + search);
    }
  }

  $("input.search").focus( function () {
    fetchUsers();
    var users      = JSON.parse(sessionStorage.users);
    var firstUsers = users.slice(0, 15);
    for (var i = 0; i < firstUsers.length; i++) {
      $("#user-search").append(
        '<option value="' + firstUsers[i] + '">' + firstUsers[i] + '</option>'
      );
    }
  });

  // * ADAPT PROFILE SEARCH SELECT ON KEYUP
  $("input.search").keyup( function (e) {

    if (e.keyCode == 16) {
      return;
    }

    var research      = $(this).val();
    console.log(sessionStorage.users);
    var users         = JSON.parse(sessionStorage.users);
    var pattern       = new RegExp(`^${research}`, "i");
    var returnedMatch = [];

    for (var i = 0; i < users.length; i++) {
      if (pattern.test(users[i])){
          returnedMatch.push(users[i]);
      }
    }

    var sortedMatch = returnedMatch.sort();

    $("#user-search").html('').append(
      '<option value>Search a profile</option>'
    );

    for (var i = 0; i < sortedMatch.length; i++) {
        $("#user-search").append(
          '<option value="' + sortedMatch[i] + '">' + sortedMatch[i] + '</option>'
        );
    }
  });

  // * ADD FRIEND
  $('#add-friend').click( function () {

    $(this).addClass('loading');

    let userToFollow = $('div.header').text();

    $.ajax({
      type: "POST",
      url: "/profile/follow",
      data : {
        userToFollow: userToFollow
      },
      success: function (response) {
        console.log(response);
        $('#add-friend').removeClass('loading');
        $('#add-friend').parent().html(
          '<div class="ui fluid disabled secondary button" id="following"><i class="user icon"></i>Following</div>'
        );
      },
      failure: function (response) {
          console.log("Unable to follow user.");
          $(this).removeClass('loading');
      }
    });



  });

  // * GO TO PROFILE PAGE ON SEARCH PROFILE SELECTION
  $('.dropdown').dropdown({
    onChange: function (value) {
      location.href='/profile/' + value;
    }
  });

});