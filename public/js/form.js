"use strict";

$(document).ready(function () {

  $(".ui.form.login").form({
    fields: {
      name: {
        identifier: "firstName",
        rules: [
          {
            type: "empty",
            prompt: "Votre prénom est manquant."
          },
          {
            type: "maxLength[30]",
            prompt: "Votre prénom ne doit pas dépasser 30 caractères."
          },
          {
            type: "regExp",
            value: /^[A-zÀ-ÖØ-öø-ÿ]+$/i,
            prompt: "Votre prénom ne doit contenir que des lettres."
          }
        ]
      },
      skills: {
        identifier: "lastName",
        rules: [
          {
            type: "empty",
            prompt: "Votre nom est manquant."
          },
          {
            type: "maxLength[30]",
            prompt: "Votre nom ne doit pas dépasser 30 caractères."
          },
          {
            type: "regExp",
            value: /^[A-zÀ-ÖØ-öø-ÿ]+$/i,
            prompt: "Votre nom ne doit contenir que des lettres."
          }
        ]
      },
      username: {
        identifier: "username",
        rules: [
          {
            type: "empty",
            prompt: "Votre pseudo est manquant."
          },
          {
            type: "minLength[3]",
            prompt: "Votre pseudo doit contenir un minimum de {ruleValue} caractères."
          },
          {
            type: "maxLength[20]",
            prompt: "Votre pseudo peut contenir un maximum de {ruleValue} caractères."
          },
          {
            type: "regExp",
            value: /^[A-zÀ-ÖØ-öø-ÿ0-9]+$/i,
            prompt: "Seul les lettre et les chiffres sont acceptés pour le pseudonyme."
          }
        ]
      },
      email: {
        identifier: "email",
        rules: [
          {
            type: "empty",
            prompt: "Votre email est manquant."
          },
          {
            type: "email",
            prompt: "Votre email n'est pas valide."
          }
        ]
      },
      password: {
        identifier: "password",
        rules: [
          {
            type: "empty",
            prompt: "Votre mot de passe est manquant."
          },
          {
            type: "regExp",
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/i,
            prompt:
              "Votre mot de passe doit contenir 1 majuscule, 1 minuscule, 1 nombre et 1 caractère spécial."
          },
          {
            type: "minLength[8]",
            prompt: "Votre mot de passe doit contenir un minimum de {ruleValue} caractères."
          }
        ]
      },
      confirmation: {
        identifier: "passwordConfirmation",
        rules: [
          {
            type: "empty",
            prompt: "Please confirm your password"
          },
          {
            type: "regExp",
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{7,}$/i,
            prompt:
              "Votre confirmation de mot de passe doit contenir 1 majuscule, 1 minuscule, 1 nombre et 1 caractère spécial."
          },
          {
            type: "minLength[8]",
            prompt:
              "Votre confirmation de mot de passe doit contenir un minimum de {ruleValue} caractères."
          },
          {
            type: "match[password]",
            prompt:
              "Votre mot de passe et sa confirmation ne sont pas identiques"
          }
        ]
      },
      terms: {
        identifier: "terms",
        rules: [
          {
            type: "checked",
            prompt: "You must agree to the terms and conditions"
          }
        ]
      }
    }
  });
  console.log("JS Loaded");
});