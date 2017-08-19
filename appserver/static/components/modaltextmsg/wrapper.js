/**
 * @fileoverview Controlling logic for the Modal Text Message feature
 * @author Ryan Thibodeaux
 * @version 1.0.1
 */

/*
 * Copyright (c) 2017, Ryan Thibodeaux. All Rights Reserved
 * see included LICENSE file (BSD 3-clause)
 */

(function() {
  require([
    "jquery",
    "ModalTextMsg",
    "splunkjs/mvc",
    "splunkjs/ready!",
    "splunkjs/mvc/simplexml/ready!"
  ], function($, ModalTextMsg, mvc) {

    "use strict";

    // get token models and setup modifier functions
    var defaultTokenModel   = mvc.Components.get('default');
    var submittedTokenModel = mvc.Components.get('submitted');
    var urlTokenModel = mvc.Components.get('url');

    function setToken(name, value, submit) {
      defaultTokenModel.set(name, value);
      if (!!submit) {
        submitTokens();
      }
    }
    function submitTokens() {
      if (submittedTokenModel && defaultTokenModel) {
        submittedTokenModel.set(defaultTokenModel.toJSON());
      }
    }


    // parse passed modal text message title
    function parseMessageTitle(token, title) {
      var value = title;
      if (typeof value !== 'undefined') {
        if (Object.prototype.toString.call(title) === '[object Array]') {
          value = title[0];
        }
        value = value.trim()
        if (value.length > 0) {
          next_title = value;
        }
      }
    }

    // parse passed modal text message content and trigger the display
    function parseMessageToken(token, msg) {
      var value = msg;
      if (typeof value !== 'undefined') {
        if (Object.prototype.toString.call(msg) === '[object Array]') {
          value = msg[0];
        }
        value = value.trim();
        if (value.length > 0) {
          next_msg = value;
          next_msg_type = token.split("_").pop();
          triggerMsgDisplay();
        }
      }
    }

    // show the modal text message
    function triggerMsgDisplay() {
      var k = new ModalTextMsg({
        title   : next_title,
        type    : next_msg_type,
        message : next_msg
      });
      k.show();

      next_title = undefined;
      next_msg   = undefined;
      next_msg_type = undefined;
    }

    /////////////////////////////////////////
    ///  Start Main Code Here
    /////////////////////////////////////////

    // array of message tokens in increasing order of priority
    const MESSAGE_TOKENS     = ["modal_msg_title", "modal_msg_debug", "modal_msg_info", "modal_msg_warn", "modal_msg_error"];
    const MESSAGE_URL_TOKENS = ["modal_msg_url_title", "modal_msg_url_debug", "modal_msg_url_info", "modal_msg_url_warn", "modal_msg_url_error"];
    var next_title    = undefined;
    var next_msg      = undefined;
    var next_msg_type = undefined;

    // parse and display messages passed via URL tokens
    var urlTokensSet = urlTokenModel.keys();
    for (var i = 0; i < MESSAGE_URL_TOKENS.length; i++) {
      if (urlTokensSet.indexOf(MESSAGE_URL_TOKENS[i]) >= 0) {
        if (MESSAGE_URL_TOKENS[i] === "modal_msg_url_title") {
          parseMessageTitle(MESSAGE_URL_TOKENS[i], urlTokenModel.get(MESSAGE_URL_TOKENS[i]));
        } else {
          parseMessageToken(MESSAGE_URL_TOKENS[i], urlTokenModel.get(MESSAGE_URL_TOKENS[i]));
        }
      }
    }

    // listen for changes to the message type tokens
    MESSAGE_TOKENS.forEach(function(str) {
      submittedTokenModel.on("change:" + str, function(model, value, options) {
        if (str === "modal_msg_title") {
          parseMessageTitle(str, value);
        } else {
          parseMessageToken(str, value);
        }
        if (typeof value !== 'undefined') {
          setToken(str, undefined, true);
        }
      });

      // see if the value was already set at page load via quick changes that
      // may not be registered in the code block above since it isn't loaded
      // quickly enough in 6.5+
      var currentValue = submittedTokenModel.get(str);
      var urlValue = urlTokenModel.get(str);
      if (typeof currentValue !== "undefined" && currentValue.length > 0) {
        if (typeof urlValue === "undefined" || urlValue.length < 1) {
          setToken(str, currentValue + " ", true);
        }
      }
    });
  },function(err) {
    // error callback
    // the error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    console.error("Error when loading dependencies in Modal Text Message wrapper: ", err);
  });
}).call(this);
