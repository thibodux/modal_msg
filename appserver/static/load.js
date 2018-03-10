/**
 * @fileoverview Setup the paths and load the Modal Text Message feature properly load components
 * @author Ryan Thibodeaux
 * @version 1.0.1
 */

/* 
 * Copyright (c) 2017-2018, Ryan Thibodeaux. All Rights Reserved
 * see included LICENSE file (BSD 3-clause) in the app's root directory
 */

(function() {
  "use strict";

  // configure the RequrieJS paths
  require.config({
    paths: {
      "ModalTextMsg" : "../app/modal_msg/components/modaltextmsg/modaltextmsg"
    }
  });

  require([
    "/static/app/modal_msg/components/modaltextmsg/wrapper.js"
  ], function() { /* do nothing */ }, function(err) {
    // error callback
    // the error has a list of modules that failed
    var failedId = err.requireModules && err.requireModules[0];
    console.error("Error when loading Modal Text Message dependencies: ", err);
  });
}).call(this);
