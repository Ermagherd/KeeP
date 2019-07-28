"use strict";

$( document ).ready(function() {

/*
.##.....##..######..########.########......######..########....###....########...######..##.....##
.##.....##.##....##.##.......##.....##....##....##.##.........##.##...##.....##.##....##.##.....##
.##.....##.##.......##.......##.....##....##.......##........##...##..##.....##.##.......##.....##
.##.....##..######..######...########......######..######...##.....##.########..##.......#########
.##.....##.......##.##.......##...##............##.##.......#########.##...##...##.......##.....##
.##.....##.##....##.##.......##....##.....##....##.##.......##.....##.##....##..##....##.##.....##
..#######...######..########.##.....##.....######..########.##.....##.##.....##..######..##.....##
*/
  function fetchUsers () {
    sessionStorage.clear();
    if ( sessionStorage.users == undefined ) {

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

/*
..######..########....###....########...######..##.....##....##....##.########.##....##.##.....##.########.
.##....##.##.........##.##...##.....##.##....##.##.....##....##...##..##........##..##..##.....##.##.....##
.##.......##........##...##..##.....##.##.......##.....##....##..##...##.........####...##.....##.##.....##
..######..######...##.....##.########..##.......#########....#####....######......##....##.....##.########.
.......##.##.......#########.##...##...##.......##.....##....##..##...##..........##....##.....##.##.......
.##....##.##.......##.....##.##....##..##....##.##.....##....##...##..##..........##....##.....##.##.......
..######..########.##.....##.##.....##..######..##.....##....##....##.########....##.....#######..##.......
*/

  $("input.search").keyup( function (e) {

    if (e.keyCode == 16) {
      return;
    }

    var research      = $(this).val();
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

/*
....###....########..########.....########.########..####.########.##....##.########.
...##.##...##.....##.##.....##....##.......##.....##..##..##.......###...##.##.....##
..##...##..##.....##.##.....##....##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.....##.##.....##....######...########...##..######...##.##.##.##.....##
.#########.##.....##.##.....##....##.......##...##....##..##.......##..####.##.....##
.##.....##.##.....##.##.....##....##.......##....##...##..##.......##...###.##.....##
.##.....##.########..########.....##.......##.....##.####.########.##....##.########.
*/

  $('#add-friend').click( function () {

    $(this).addClass('loading');
    let that = this
    let userToFollow = $(this).parent().parent().parent().find(".header").text();

    $.ajax({
      type: "POST",
      url: "/profile/add-friend",
      data : {
        userToFollow: userToFollow
      },
      success: function (response) {
        $(that).removeClass('loading');
        $(that).parent().html(
          '<div class="ui fluid disabled secondary button" id="following"><i class="paper plane icon icon"></i>Demander en attente</div>'
        );
      },
      failure: function (response) {
          console.log("Unable to send friend request user.");
          $(that).removeClass('loading');
      }
    });
  });

/*
.##.....##.##....##.########..#######..##.......##........#######..##......##....########.########..####.########.##....##.########.
.##.....##.###...##.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##.....##..##..##.......###...##.##.....##
.##.....##.####..##.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.##.##.######...##.....##.##.......##.......##.....##.##..##..##....######...########...##..######...##.##.##.##.....##
.##.....##.##..####.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##...##....##..##.......##..####.##.....##
.##.....##.##...###.##.......##.....##.##.......##.......##.....##.##..##..##....##.......##....##...##..##.......##...###.##.....##
..#######..##....##.##........#######..########.########..#######...###..###.....##.......##.....##.####.########.##....##.########.
*/

  $('#remove-friend-accepted').click( function () {

    $(this).addClass('loading');
    let that = this
    let userToRemove = $(this).parent().parent().parent().find(".header").text();

    console.log(userToRemove);

    $.ajax({
      type: "POST",
      url: "/profile/remove-friend",
      data : {
        userToRemove: userToRemove
      },
      success: function (response) {
        console.log(response);
        $(that).removeClass('loading');
        $(that).parent().html(
          '<div class="ui fluid primary button" id="add-friend"><i class="user plus icon"></i>Demander en ami</div>'
        );
      },
      failure: function (response) {
          console.log("Unable to unfollow user.");
          $(that).removeClass('loading');
      }
    });
  });

/*
....###....########..########..########...#######..##.....##.########....########.########..####.########.##....##.########.
...##.##...##.....##.##.....##.##.....##.##.....##.##.....##.##..........##.......##.....##..##..##.......###...##.##.....##
..##...##..##.....##.##.....##.##.....##.##.....##.##.....##.##..........##.......##.....##..##..##.......####..##.##.....##
.##.....##.########..########..########..##.....##.##.....##.######......######...########...##..######...##.##.##.##.....##
.#########.##........##........##...##...##.....##..##...##..##..........##.......##...##....##..##.......##..####.##.....##
.##.....##.##........##........##....##..##.....##...##.##...##..........##.......##....##...##..##.......##...###.##.....##
.##.....##.##........##........##.....##..#######.....###....########....##.......##.....##.####.########.##....##.########.
*/

$('.approve-friend').click( function () {

  $(this).addClass('loading');
  console.log('target');

  let that = this;
  let userToApprove = $(this).parent().parent().parent().find(".header").text();

  $.ajax({
    type: "POST",
    url: "/profile/approve-friend",
    data : {
      userToApprove: userToApprove
    },
    success: function (response) {
      console.log(response);
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
      $('#friends-cards').find(".ui.cards").append(
        '<div class="card"><div class="content"><div class="header"><a href="/profile/' + userToApprove + '">' + userToApprove + '</a></div></div><div class="extra content"><div class="ui buttons"><div class="ui negative button remove-friend">Remove</div></div></div>'
      );
    },
    failure: function (response) {
        console.log("Unable to approve user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########..########.##.....##..#######..##.....##.########....########.########..####.########.##....##.########.
.##.....##.##.......###...###.##.....##.##.....##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......####.####.##.....##.##.....##.##..........##.......##.....##..##..##.......####..##.##.....##
.########..######...##.###.##.##.....##.##.....##.######......######...########...##..######...##.##.##.##.....##
.##...##...##.......##.....##.##.....##..##...##..##..........##.......##...##....##..##.......##..####.##.....##
.##....##..##.......##.....##.##.....##...##.##...##..........##.......##....##...##..##.......##...###.##.....##
.##.....##.########.##.....##..#######.....###....########....##.......##.....##.####.########.##....##.########.
*/

$('.remove-friend').click( function () {

  $(this).addClass('loading');
  console.log('target');

  let that = this;
  let userToRemove = $(this).parent().parent().parent().find(".header").text();

  console.log(userToRemove);

  $.ajax({
    type: "POST",
    url: "/profile/remove-friend",
    data : {
      userToRemove: userToRemove
    },
    success: function (response) {
      console.log(response);
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
    },
    failure: function (response) {
        console.log("Unable to remove user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########..########..######..##.......####.##....##.########....########.########..####.########.##....##.########.
.##.....##.##.......##....##.##........##..###...##.##..........##.......##.....##..##..##.......###...##.##.....##
.##.....##.##.......##.......##........##..####..##.##..........##.......##.....##..##..##.......####..##.##.....##
.##.....##.######...##.......##........##..##.##.##.######......######...########...##..######...##.##.##.##.....##
.##.....##.##.......##.......##........##..##..####.##..........##.......##...##....##..##.......##..####.##.....##
.##.....##.##.......##....##.##........##..##...###.##..........##.......##....##...##..##.......##...###.##.....##
.########..########..######..########.####.##....##.########....##.......##.....##.####.########.##....##.########.
*/

$('.decline-friend').click( function () {

  $(this).addClass('loading');
  console.log('target');

  let that = this;
  let userToDecline = $(this).parent().parent().parent().find(".header").text();

  console.log(userToDecline);

  $.ajax({
    type: "POST",
    url: "/profile/decline-friend",
    data : {
      userToDecline: userToDecline
    },
    success: function (response) {
      console.log(response);
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
    },
    failure: function (response) {
        console.log("Unable to block user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.##.....##.##....##.########..##........#######...######..##....##....########.########..####.########.##....##.########.
.##.....##.###...##.##.....##.##.......##.....##.##....##.##...##.....##.......##.....##..##..##.......###...##.##.....##
.##.....##.####..##.##.....##.##.......##.....##.##.......##..##......##.......##.....##..##..##.......####..##.##.....##
.##.....##.##.##.##.########..##.......##.....##.##.......#####.......######...########...##..######...##.##.##.##.....##
.##.....##.##..####.##.....##.##.......##.....##.##.......##..##......##.......##...##....##..##.......##..####.##.....##
.##.....##.##...###.##.....##.##.......##.....##.##....##.##...##.....##.......##....##...##..##.......##...###.##.....##
..#######..##....##.########..########..#######...######..##....##....##.......##.....##.####.########.##....##.########.
*/

$('.unblock-friend').click( function () {

  $(this).addClass('loading');
  console.log('target');

  let that = this;
  let userToUnblock = $(this).parent().parent().parent().find(".header").text();

  console.log(userToUnblock);

  $.ajax({
    type: "POST",
    url: "/profile/unblock-friend",
    data : {
      userToUnblock: userToUnblock
    },
    success: function (response) {
      console.log(response);
      $(that).removeClass('loading');
      $(that).parent().parent().parent().remove();
      $('#friends-cards').find(".ui.cards").append(
        '<div class="card"><div class="content"><div class="header"><a href="/profile/' + userToUnblock + '">' + userToUnblock + '</a></div></div><div class="extra content"><div class="ui buttons"><div class="ui basic red button remove-friend">Remove</div></div></div>'
      );
    },
    failure: function (response) {
        console.log("Unable to unblock user.");
        $(that).removeClass('loading');
    }
  });
});

/*
.########...#######...######..########
.##.....##.##.....##.##....##....##...
.##.....##.##.....##.##..........##...
.########..##.....##..######.....##...
.##........##.....##.......##....##...
.##........##.....##.##....##....##...
.##.........#######...######.....##...
*/

$("#user-post").click( function () {

  let text = $(this).text();
  let placeHolder = 'What do you want to share ?';
  if (text === placeHolder) {
    let text = $(this).text('');
    console.log(text);
  }

})

$('#post-submit').click( function (e) {

  let that = this;
  let placeHolder = 'What do you want to share ?';
  $(that).addClass('loading');
  let content = $('#user-post').val();
  console.log(content);

  $.ajax({
    type: "POST",
    url: "/profile/post-comment",
    data : {
      content: content
    },
    success: function (response) {
      console.log(response);
      $(that).removeClass('loading');
      // $(that).parent().parent().parent().remove();
      // $('#friends-cards').find(".ui.cards").append(
      //   '<div class="card"><div class="content"><div class="header"><a href="/profile/' + userToUnblock + '">' + userToUnblock + '</a></div></div><div class="extra content"><div class="ui buttons"><div class="ui basic red button remove-friend">Remove</div></div></div>'
      // );
      $('#user-post').val(placeHolder);
    },
    failure: function (response) {
        console.log("Unable to post comment.");
        $(that).removeClass('loading');
    }
  });

});


/*
..######....#######.....########..#######.....########..########...#######..########.####.##.......########
.##....##..##.....##.......##....##.....##....##.....##.##.....##.##.....##.##........##..##.......##......
.##........##.....##.......##....##.....##....##.....##.##.....##.##.....##.##........##..##.......##......
.##...####.##.....##.......##....##.....##....########..########..##.....##.######....##..##.......######..
.##....##..##.....##.......##....##.....##....##........##...##...##.....##.##........##..##.......##......
.##....##..##.....##.......##....##.....##....##........##....##..##.....##.##........##..##.......##......
..######....#######........##.....#######.....##........##.....##..#######..##.......####.########.########
*/

  $('.dropdown').dropdown({
    onChange: function (value) {
      location.href='/profile/' + value;
    }
  });

/*
.########..####..######..########..##..........###....##....##....########.########..####.########.##....##.########...######.
.##.....##..##..##....##.##.....##.##.........##.##....##..##.....##.......##.....##..##..##.......###...##.##.....##.##....##
.##.....##..##..##.......##.....##.##........##...##....####......##.......##.....##..##..##.......####..##.##.....##.##......
.##.....##..##...######..########..##.......##.....##....##.......######...########...##..######...##.##.##.##.....##..######.
.##.....##..##........##.##........##.......#########....##.......##.......##...##....##..##.......##..####.##.....##.......##
.##.....##..##..##....##.##........##.......##.....##....##.......##.......##....##...##..##.......##...###.##.....##.##....##
.########..####..######..##........########.##.....##....##.......##.......##.....##.####.########.##....##.########...######.
*/

  $('a.display-friends').click(function (e) {

    $('#wallwrapper').toggleClass("hiddenthing");
    $('#friendswrapper').toggleClass("hiddenthing");
  });

});