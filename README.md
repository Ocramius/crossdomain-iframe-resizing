Cross-Domain iFrame resizing
=====

This project aims to be a simple to use Javascript implementation of the problems
we usually meet when working with cross-domain iFrames.
It is not a solution for the cases where you can't edit both the contents of the
parent window and the iframe placed on the separate domain.
Current logic uses polling and hash, so this would eventually break hash-based
routing in your JS apps.

Requirements
=====

 - jQuery >= 1.2.6 in both iFrame and parent window (you can strip this
   requirement if you want. jQuery is just used to listen to the location hash 
   change event and to overload window.onload)

Installation
=====

 - clone/submodule this repository into your project
 - load js/FrameManager.js from the document that contains the frames
 - load js/HeightPublisher.js from the frame that is dynamically resized

Credits
=====

The logic and code for this application was mainly taken from the following
concepts:

 - http://geekswithblogs.net/rashid/archive/2007/01/13/103518.aspx by
   @kazimanzurrashid
 - http://css-tricks.com/cross-domain-iframe-resizing/ by @chriscoyier