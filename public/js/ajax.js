"use strict";

window.addEventListener("DOMContentLoaded", function() {


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

  function appendUsersV1 () {
    // * USER SEARCH
    if ( search == undefined) {
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
              let array = [];
              response.forEach(element => {
                array.push(element);
              });
              keyValue = array;
            },
            failure: function (response) {
                console.log("wrong response from database call");
            }
        });
        return keyValue;
      }
      var search = GetString();
    }

    function appendUsersSearch () {
      search.forEach(element => {
        $("#user-search-bar-options").append(
          '<option value="' + element.username + '">' + element.username + '</option>'
        );
      });
    }
    appendUsersSearch();

  }
  // appendUsersV1();

  $(".ui.fluid.search.dropdown.selection.active.visible").click(function () {

    console.log('that\'s it');
    // $(this).css({backgroundColor: "blue"});

    // $("#user-search-bar-options").siblings('i input').keyup(function() {
    //   console.log( "Handler for .keyup() called." );
    // });

  });
});