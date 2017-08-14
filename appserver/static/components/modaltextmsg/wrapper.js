/**
 * @fileoverview Controlling logic for the Modal Text Message feature
 * @author Ryan Thibodeaux
 * @version 1.0.0
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
      if (typeof value !== 'undefined' && MESSAGE_TOKENS.indexOf(token) >= 0) {
        if (Object.prototype.toString.call(msg) === '[object Array]') {
          value = msg[0];
        }
        value = value.trim();
        if (value.length > 0) {
          next_msg = value;
          next_msg_type = token.replace("modal_msg", "").replace("_", "");
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
    const MESSAGE_TOKENS = ["modal_msg_debug", "modal_msg_info", "modal_msg_warn", "modal_msg_error"];
    var next_title = undefined;
    var next_msg = undefined;
    var next_msg_type = undefined;

    // listen for changes to title token
    submittedTokenModel.on("change:modal_msg_title", function(model, value, options) {
      parseMessageTitle("modal_msg_title", value);
      if (typeof value !== 'undefined') {
        setToken("modal_msg_title", undefined, true);
      }
    });

    // listen for changes to the message type tokens
    MESSAGE_TOKENS.forEach(function(str) {
      submittedTokenModel.on("change:" + str, function(model, value, options) {
        if (typeof value !== 'undefined') {
          parseMessageToken(str, value);
          setToken(str, undefined, true);
        }
      });
    });

    //parse and display messages passed via URL tokens
    var urlTokensSet = urlTokenModel.keys();
    if (urlTokensSet.indexOf("modal_msg_title") >= 0) {
      parseMessageTitle(modal_msg_title, urlTokenModel.get("modal_msg_title"));
    }
    for (var i = MESSAGE_TOKENS.length - 1; i >= 0; --i) {
      if (urlTokensSet.indexOf(MESSAGE_TOKENS[i]) >= 0) {
        parseMessageToken(MESSAGE_TOKENS[i], urlTokenModel.get(MESSAGE_TOKENS[i]));
        break;
      }
    }
  },function(err) {
    // error callback
    // the error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    requirejs.undef(failedId);
    console.error("Error when loading dependencies in Modal Text Message wrapper: ", err);
  });
}).call(this);
