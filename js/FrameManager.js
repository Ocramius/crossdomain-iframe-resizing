(function(exports, $) {

    var FrameManager = {

        currentFrameId : '',
        currentFrameHeight : 0,
        lastFrameId : '',
        lastFrameHeight : 0,
        resizeTimerId : null,

        resizeFrames: function() {
            FrameManager.retrieveFrameIdAndHeight();
            if ((FrameManager.currentFrameId != FrameManager.lastFrameId) || (FrameManager.currentFrameHeight != FrameManager.lastFrameHeight)) {
                var iframe = document.getElementById(FrameManager.currentFrameId.toString());
                if (iframe == null) {
                    return true;
                }
                iframe.style.height = FrameManager.currentFrameHeight.toString() + 'px';
                FrameManager.lastFrameId = FrameManager.currentFrameId;
                FrameManager.lastFrameHeight = FrameManager.currentFrameHeight;
                return true;
            }
            return false;
        },

        retrieveFrameIdAndHeight: function() {
            if (window.location.hash.length == 0) return;
            var hashValue = new String(window.location.hash.substring(1));
            var queryParams = EncoderTools.parseHashParams(hashValue);
            if(
                typeof queryParams['frameId'] != 'undefined'
                && queryParams['frameId']
            ) {
                FrameManager.currentFrameId = queryParams['frameId'];
            }
            if(
                typeof queryParams['height'] != 'undefined'
                && queryParams['height']
            ) {
                FrameManager.currentFrameHeight = parseInt(queryParams['height']) + 15;
            }
        },

        registerFrame: function(frame) {
            var currentLocation = window.location.href;
            var hashIndex = currentLocation.indexOf('#');
            if (hashIndex > -1) {
                currentLocation = currentLocation.substring(0, hashIndex);
            }
            var src = new String(frame.src);
            var params = {};
            src = src.split('#')[0];
            if(src.indexOf('?') >= 0) {
                var qs = src.split('?')[1];
                qs = qs.split('#')[0];
                params = EncoderTools.parseHashParams(qs);
            }
            params['frameId'] = frame.id;
            params['lastLocation'] = currentLocation;
            frame.contentWindow.location = src + '#' + EncoderTools.buildHashParams(params);
        }

    };
    
    $(function(){
        if (window.onhashchange) {
            $(window).bind('hashchange', function(e) {
                if (FrameManager.resizeFrames()) {
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
            window.setInterval(FrameManager.resizeFrames, 300);
        }
        $('iframe').each(function(){
            FrameManager.registerFrame(this);
        });
    });

    exports.FrameManager = FrameManager;

})(window, jQuery);
