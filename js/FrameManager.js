(function(exports, $) {

    var parseQueryString = function (queryString) {
        queryString = new String(queryString);
        var urlParams = {},
            e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function (s) {return decodeURIComponent(s.replace(a, " "));};

        while (e = r.exec(queryString)) {
            urlParams[d(e[1])] = d(e[2]);
        }
        return urlParams;
    };

    var buildQueryString = function(parameters) {
        var qs = '';
        for(var key in parameters) {
            var value = parameters[key];
            qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
        if (qs.length > 0){
            qs = qs.substring(0, qs.length-1);
        }
        return qs;
    };

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
            var queryParams = parseQueryString(hashValue);
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
            var currentLocation = location.href;
            var hashIndex = currentLocation.indexOf('#');
            if (hashIndex > -1) {
                currentLocation = currentLocation.substring(0, hashIndex);
            }
            var src = new String(frame.src);
            var params = {};
            if(src.indexOf('?') >= 0) {
                var qs = src.split('?')[1];
                src = src.split('?')[0];
                qs = qs.split('#')[0];
                params = parseQueryString(qs);
            }
            params['frameId'] = frame.id;
            frame.contentWindow.location = src 
                + '?' + buildQueryString(params)
                + '#' + currentLocation;
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
