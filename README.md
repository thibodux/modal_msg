# README for the Modal Text Message App for Splunk

## Table of Contents

- Overview
    - About
    - Release Notes
    - Support
    - License
- Installation and Configuration
    - Requirements
    - Installation
    - Configuration
- User Guide
    - Concepts
    - Usage
    - Upgrading

---

## Overview

The Modal Text Message App for Splunk is a library to extend Splunk dashboards with a modal text message feature that is activated by setting specific tokens in Splunk Dashboards.

### About

Author: Ryan Thibodeaux<br/>
Version: 1.1.0<br/>
License: BSD 3-clause "New" or "Revised" License<br/>
Folder Name: modal_msg<br/>


| Splunk Components | Added?|
| --- | --- |
| Indexes | FALSE |
| Inputs | FALSE |
| Summarization | FALSE |
| Scripts | FALSE |
| Binaries | FALSE |
| Data Models / Sets | FALSE |
| Saved Searches | FALSE |


### Release Notes

#### v1.1.0

- CSS Updates
    - Increased width of modal window
    - Increased modal window body font
    - Fixed inconsistencies with border radius/corner settings
    - Made app's CSS more independent of Bootstrap settings 
- Changed navigation bar color to dark gray
- Fixed border around app logo

#### v1.0.3

- Updated version number on About page
- Updated App description
- Gave license file ".txt" extension to satisfy Splunk App-Inspect tool

#### v1.0.2

- Fixed CSS to make consistent the corners of header and footer sections

#### v1.0.1

- Fixed oversight that tokens in 6.5 and 6.6 may not be detected in the change event handlers if the dashboard tokens are changed quickly after loading
- Small change to CSS path loading 
- Removed part of requirejs error handling

#### v1.0.0

Initial release with support for custom text messages.

### Support

Additional information and previous releases can be found on the [Github page](https://github.com/thibodux/modal_msg).

### License

This app and the library contained within are released under the BSD 3-Clause "New" or "Revised" License. 

#### Third-party Software

None.

-----

## Installation and Configuration

### Building

Skip this if you downloaded the app from Splunkbase.

Assuming you are checking out the source from Github, here are the steps to build the app tarball to then install in Splunk (assumes Linux or Mac). Note, make sure you keep the top-level repo folder name as "modal_msg" or you will potentially build a poorly structured application package.

```bash
$ cd <ROOT_DIRECTORY_OF_YOUR_CHOICE>
$ git clone https://github.com/thibodux/modal_msg modal_msg
$ tar c --exclude='.git' --exclude='.gitignore' modal_msg > modal_msg.tar
$ gzip -q modal_msg.tar
```

### Software requirements

The included demo / example dashboards require Splunk 6.3 or newer

The included software library in the app requires Splunk 6.0 or newer.

The [Splunk Enterprise system requirements](https://docs.splunk.com/Documentation/Splunk/latest/Installation/Systemrequirements) apply.

### Installation

This app can be installed using the Splunk GUI, CLI, or Deployer. 

This app is intended to extend Splunk dashboards, so it should be installed on Splunk Search Head components, such as:

* Stand-alone Splunk Enterprise servers
* Splunk Search-Head servers in distributed or clustered environments

This app should NOT be installed on Indexers, Heavy Forwarders, or Universal Forwarders.

### Configuration

No extra steps are required in order to make the app / library function properly following installation.

-----

## User Guide

### Concepts
This app provides a convenient way to extend Splunk dashboards with modal text message prompts. The app comes with pre-defined types / levels of modal windows that use different color schemes (e.g., Errors appear in RED).

### Usage

#### Loading the library

A Splunk dashboard must first include this app's library in order to use the features. This is accomplished by adding the loader JavaScript file to the dashboard. In the case of SimpleXML, update the top-level XML to pull in the script, e.g.,

`<dashboard script="modal_msg:load.js">` 

OR 

`<form script="modal_msg:load.js">` 

For HTML dashboards, you need to add a the following element before the closing `</body>` tag, 

`<script src="{{SPLUNKWEB_URL_PREFIX}}/static/app/modal_msg/load.js" type="text/javascript"></script>`
`
#### Copying the library

If you want to use the library in the `/appserver/static/components/` folder in your own app (i.e., you just want to use the code without installing this Splunk app), you must copy the folder `/appserver/static/components/modaltextmsg` into your app's `/appserver/static/components/` folder. You must then copy the contents of the included file `/appserver/static/load.js` to setup the RequireJS paths to suit your app's needs. Naming conventions outside of this app's library do not matter - you must update the paths accordingly.

#### Triggering Modal Messages in SimpleXML

This library monitors specific Splunk tokens to trigger modal messages. The app allows a developer to modify the Title and the Message content in the modal window.

The app includes 4 built-in types of modal messages: debug, info, warn, and error.

The corresponding tokens and there effects are described below:

| Token | Effect |
| --- | --- |
| modal_msg_title | Set the Title of next Modal Window to passed string |
| modal_msg_info | Trigger "info" message set to passed string |
| modal_msg_debug | Trigger "debug" message set to passed string |
| modal_msg_warn | Trigger "warning" message set to passed string |
| modal_msg_error | Trigger "error" message set to passed string |

Note, the title string set in the "modal_msg_title" token only applies to the next modal window, i.e., the title is reset for each message. If the title is not set, a default title corresponding to the message type is used, e.g., "Error", "Warning", etc.

The modal message content can only contain text strings and the HTML line break tag (`<br/>`). All other HTML will be escaped.

##### SimpleXML Example

Here is an example of how to trigger a warning message when no results are returned for a search.

```xml
<search>
  <query> ... </query>
  <done>
    <condition match="'job.resultCount' == 0">
    <set token="modal_msg_title">Warning: No Results</set>
    <set token="modal_msg_warn">Your base search returned no results.&lt;br/&gt;Consider adjusting the search period or input filters.</set>
    </condition>
  </done>
</search>
```

#### Triggering Modal Messages at Dashboard Load time via URL

Because of how Splunk handles tokens in the URL, there is a separate set of tokens to trigger modal windows via the URL. The same logic and patterns hold as for the tokens in SimpleXML - the only difference is an addition of "_url" to the token names 

| Token | Effect |
| --- | --- |
| modal_msg_url_title | Set the Title of Modal Window when the dashboard loads |
| modal_msg_url_info | The "info" message for the dashboard load time modal window |
| modal_msg_url_debug | The "debug" message for the dashboard load time modal window |
| modal_msg_url_warn | The "warning" message for the dashboard load time modal window |
| modal_msg_url_error | The "error" message for the dashboard load time modal window |

##### URL Example

The app library is designed to look for the triggering tokens passed via the URL. If any of the message triggering tokens are set in the URL at the time of loading the dashboard, the library will display on the first highest priority message it finds.

You can see an example by installing the app and then adding the following string to URL of the demo dashboard:

`modal_msg_url_title=Test%20Loading%20Message&modal_msg_url_error=This%20message%20was%20set%20in%20the%20URL`

So an example of the full URL would be as follows:

`http://<YOUR_SPLUNK_SERVER>:8000/en-US/app/modal_msg/demo?modal_msg_url_title=Test%20Loading%20Message&modal_msg_url_error=This%20message%20was%20set%20in%20the%20URL`

### Upgrading

Upgrade the app by installing new versions over previous installations. Restarts may or may not be required depending on what new files / features have been added. Splunk should indicate if a restart is required.
