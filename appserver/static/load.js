/**
 * @fileoverview Setup the paths and load the Modal Text Message feature properly load components
 * @author Ryan Thibodeaux
 * @version 1.0.0
 */

/* 
 * Copyright (c) 2017, Ryan Thibodeaux. All Rights Reserved
 * see included LICENSE file (BSD 3-clause) in the app's root directory
 */

(function() {
  "use strict";

  // configure the RequrieJS paths
  require.config({
    paths: {
      "appBase"      : "../app/modal_msg",
      "ModalTextMsg" : "../app/modal_msg/components/modaltextmsg/modaltextmsg"
    }
  });

  // remove the first CSS line that follows and uncomment the CSS 
  // require statement in ./components/modaltextmsg/modaltextmsg.js 
  // once getting the require-css plugin works as desired
  require([
    "css!/static/app/modal_msg/components/modaltextmsg/modaltextmsg.css",
    "/static/app/modal_msg/components/modaltextmsg/wrapper.js"
  ], function() { /* do nothing */ }, function(err) {
    // error callback
    // the error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    requirejs.undef(failedId);
    console.error("Error when loading Modal Text Message dependencies: ", err);
  });
}).call(this);
