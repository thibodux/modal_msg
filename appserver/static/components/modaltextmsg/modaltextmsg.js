/**
 * @fileoverview Class definition for Modal Text Message
 * @author Ryan Thibodeaux
 * @version 1.0.0
 */

/*
 * Copyright (c) 2017, Ryan Thibodeaux. All Rights Reserved
 * see included LICENSE file (BSD 3-clause)
 */


define(function(require, exports, module) {

  "use strict";

  // escapes any HTML passed into string
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');

  /* uncomment the following line if
   * you find a workaround to load
   * the CSS here instead of in the
   * the higher-level RequireJS calls
   */
  //require("css!./modaltextmsg.css");


/**
 * Creates a new ModalTextMsg object.
 * @class
 * @classdesc Modal Text Message class that displays messages as a modal box.
 * @param {Object} options
 * @param {String} options.type  Type of text message to show
 * @param {String} options.title Title for the text message
 * @param {String} options.message Message content string
 * @param {String} options.id HTML ID to use
 */
  var ModalTextMsg = Backbone.View.extend({

    className: 'ModalTextMsg',
    content: undefined,

    defaults: {
      title: "",    // title to show on top of the modal window
      type: "info", // the type of modal message [info, debug, warn, error]
      message: "",  // the message to display in the modal window
      id: "ModalTextMsgID", // the html ID to use for the modal text message
    },

    // initialize ModalTextMsg object
    initialize: function(options) {
      this.options = options;
      this.options.title   = (typeof this.options.title === 'undefined' ? this.defaults.title : escapeHTML(this.options.title).trim());
      this.options.type    = (typeof this.options.type === 'undefined' ? this.defaults.type : escapeHTML(this.options.type).trim().toLowerCase());
      this.options.message = (typeof this.options.message === 'undefined' ? this.defaults.message : escapeHTML(this.options.message).trim());
      this.options.id      = (typeof this.options.id === 'undefined' ? this.defaults.id : escapeHTML(this.options.id).trim());
      this.template = _.template(this.template);

      // enforce the type to be of a specific value
      switch(this.options.type) {
        case "error":
          this.options.title = (this.options.title === "" ? "Error" : this.options.title);
          break;
        case "warn":
          this.options.title = (this.options.title === "" ? "Warning" : this.options.title);
          break;
        case "debug":
          this.options.title = (this.options.title === "" ? "Debug" : this.options.title);
          break;
        case "info":
        default:
          this.options.type = "info";
          this.options.title = (this.options.title === "" ? "Info" : this.options.title);
          break;
      }

      // setup content div by breaking up message into
      // paragraphs for every <br/> tag found
      var c = document.createElement('div');
      c.id = "modal-text-msg-content";
      var msgParts = this.options.message.split("&lt;br/&gt;");
      msgParts.forEach( function(str) {
        var para = document.createElement("p");
        var t = document.createTextNode(str.trim());
        para.appendChild(t);
        c.appendChild(para);
      });
      this.content = c;
    },

    // click listeners
    events: {
      'click .modal-text-msg-close'    : 'close',
      'click .modal-text-msg-backdrop' : 'close'
    },

    // render the content based on the template
    render: function() {
      this.$el.html(this.template({
        id : this.options.id,
        title : this.options.title,
        type : this.options.type
      }));
      return this;
    },

    // show the modal text message where we render it
    // if it is not already set
    show: function() {
      var p = $('#' + this.id);
      if (!p.length) {
        $(document.body).append(this.render().el);
        this.$el.find(".modal-body").append(this.content);
      }
      this.$el.show();

      // make backdrops transparent for any stacked modals
      var modals = $("." + this.className);
      modals.each(function(i, m) {
        if (i > 0) {
          if (!$(m).children(".modal-text-msg-backdrop").hasClass("modal-text-msg-backdrop-clear")) {
            $(m).children(".modal-text-msg-backdrop").addClass("modal-text-msg-backdrop-clear");
          }
        } else if (i == 0) {
          if ($(m).children(".modal-text-msg-backdrop").hasClass("modal-text-msg-backdrop-clear")) {
            $(m).children(".modal-text-msg-backdrop").removeClass("modal-text-msg-backdrop-clear");
          }
        }
      });

      return this;
    },

    // close the modal window and destroy the content
    close: function() {
      this.unbind();
      this.remove();
      return this;
    },

    // html template
    template: '<div id="<%- id %>" class="modal modal-text-msg" role="dialog">' +
                '<div class="modal-header <%- type %>">' +
                  '<div class="modal-title"><%- title %></div>' +
                '</div>' +
                '<div class="modal-body"></div>' +
                '<div class="modal-footer"><button class="close modal-text-msg-close"/></div>' +
              '</div>' +
              '<div class="modal-backdrop modal-text-msg-backdrop"></div>'
  });
  return ModalTextMsg;
});
