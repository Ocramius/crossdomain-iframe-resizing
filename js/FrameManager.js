(function (window, exports, $, EncoderTools) {
    "use strict";

    var frameManager = {

        currentFrameId : '',
        currentFrameHeight : 0,
        lastFrameId : '',
        lastFrameHeight : 0,
        resizeTimerId : null,

        resizeFrames: function () {
            frameManager.retrieveFrameIdAndHeight();
            if ((frameManager.currentFrameId != frameManager.lastFrameId) || (frameManager.currentFrameHeight != FrameManager.lastFrameHeight)) {
                var iframe = window.document.getElementById(frameManager.currentFrameId.toString());
                if (iframe === null) {
                    return true;
                }
                iframe.style.height = frameManager.currentFrameHeight.toString() + 'px';
                frameManager.lastFrameId = frameManager.currentFrameId;
                frameManager.lastFrameHeight = frameManager.currentFrameHeight;
                return true;
            }
            return false;
        },

        retrieveFrameIdAndHeight: function () {
            if (window.location.hash.length == 0) {
                return;
            }

            var hashValue = new String(window.location.hash.substring(1)),
                queryParams = EncoderTools.parseHashParams(hashValue);
            if (
                typeof queryParams.frameId != 'undefined' &&
                    queryParams.frameId
            ) {
                frameManager.currentFrameId = queryParams.frameId;
            }
            if (
                typeof queryParams.height != 'undefined' &&
                    queryParams.height
            ) {
                frameManager.currentFrameHeight = parseInt(queryParams.height, 10) + 15;
            }
        },

        registerFrame: function (frame) {
            var currentLocation = window.location.href,
                hashIndex = currentLocation.indexOf('#'),
                src,
                params,
                qs;
            if (hashIndex > -1) {
                currentLocation = currentLocation.substring(0, hashIndex);
            }
            src = new String(frame.src);
            params = {};
            src = src.split('#')[0];
            if (0 <= src.indexOf('?')) {
                qs = src.split('?')[1];
                qs = qs.split('#')[0];
                params = EncoderTools.parseHashParams(qs);
            }
            params.frameId = frame.id;
            params.lastLocation = currentLocation;
            frame.contentWindow.location = src + '#' + EncoderTools.buildHashParams(params);
        }

    };

    $(function () {
        if (window.onhashchange) {
            $(window).bind('hashchange', function (e) {
                if (frameManager.resizeFrames()) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.history && window.history.replaceState) {
                        window.history.replaceState(
                            null,
                            null,
                            '#FrameManager'
                        );
                    } else {
                        window.location.hash = 'FrameManager';
                    }
                }
            });
        } else {
            window.setInterval(frameManager.resizeFrames, 300);
        }
        $('iframe').each(function () {
            frameManager.registerFrame(this);
        });
    });

    exports.FrameManager = frameManager;

}(window, window, jQuery, EncoderTools));
