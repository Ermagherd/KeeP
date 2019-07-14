'use strict';

window.addEventListener("DOMContentLoaded", function(){

  $('.ui.form.login')
  .form({
    fields: {
      name: {
        identifier: 'firstName',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your first name'
          },
          {
            type   : 'maxLength[30]',
            prompt : 'Your first name can\'t exceed 30 characters.'
          },
          {
            type: 'regExp',
            value: /^[A-zÀ-ÖØ-öø-ÿ]+$/i,
            prompt : 'Your first name must contain only alpha characters'
          },
        ]
      },
      skills: {
        identifier: 'lastName',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your last name'
          },
          {
            type   : 'maxLength[30]',
            prompt : 'Your last name can\'t exceed 30 characters.'
          },
          {
            type: 'regExp',
            value: /^[A-zÀ-ÖØ-öø-ÿ]+$/i,
            prompt : 'Your last name must contain only alpha characters'
          },
        ]
      },
      username: {
        identifier: 'username',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a username'
          },
          {
            type   : 'minLength[3]',
            prompt : 'Your password must be at least {ruleValue} characters'
          },
          {
            type   : 'maxLength[20]',
            prompt : 'Your password must be at least {ruleValue} characters'
          },
          {
            type   : 'regExp',
            value  : /^[A-zÀ-ÖØ-öø-ÿ0-9]+$/i,
            prompt : 'Only letters and numbers are allowed for username'
          },
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter an email'
          },
          {
            type   : 'email',
            prompt : 'You must enter a valid email'
          }
        ]
      },
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          },
          {
            type   : 'regExp',
            value  : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/i ,
            prompt : 'Your password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
          },
          {
            type   : 'minLength[8]',
            prompt : 'Your password must be at least {ruleValue} characters'
          }
        ]
      },
      confirmation: {
        identifier: 'passwordConfirmation',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please confirm your password'
          },
          {
            type   : 'regExp',
            value  : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/i ,
            prompt : 'Your password confirmation must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
          },
          {
            type   : 'minLength[8]',
            prompt : 'Your password confirmation must be at least {ruleValue} characters'
          },
          {
            type   : 'match[password]',
            prompt : 'Your password confirmation must be at least {ruleValue} characters'
          }
        ]
      },
      terms: {
        identifier: 'terms',
        rules: [
          {
            type   : 'checked',
            prompt : 'You must agree to the terms and conditions'
          }
        ]
      }
    }
  })
  ;
  console.log('JS Loaded');

});