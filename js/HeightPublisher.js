(function(exports, $) {

    var HeightPublisher = (function() {

        var lastLocation = '';
        
        this.publishHeight = function() {
            if (window.location.hash.length == 0) return;
            var frameId = getFrameId();
            if (frameId == '') {
                return;
            }
            var actualHeight = getBodyHeight();
            var currentHeight = getViewPortHeight();
            if  (Math.abs(actualHeight/currentHeight - 1) > 0.05) {
                // unsafe check, should be stricter
                if(window.location.hash.substring(1).indexOf('http') >= 0) {
                    lastLocation = window.location.hash.substring(1);
                }
                if(lastLocation != '') {
                    window.top.location = lastLocation + '#'
                        + buildQueryString({
                            frameId: frameId,
                            height: actualHeight.toString()
                        });
                }
            }
        };

        var getFrameId = function() {
            var qs = parseQueryString(window.location.search.substring(1));
            var frameId = qs['frameId'];
            var hashIndex = (typeof frameId == "string") ? frameId.indexOf('#') : -1;
            if (hashIndex > -1) {
                frameId = frameId.substring(0, hashIndex);
            }
            return frameId;
        };

        var getBodyHeight = function() {
            return $(document.body).outerHeight();
        };

        var getViewPortHeight = function() {
            var height = 0;
            if (window.innerHeight) {
                height = window.innerHeight - 18;
            } else if (
                document.documentElement
                && document.documentElement.clientHeight
            ) {
                height = document.documentElement.clientHeight;
            } else if (document.body && document.body.clientHeight) {
                height = document.body.clientHeight;
            }
            return height;
        };

        var parseQueryString = function (queryString) {
            queryString = new String(queryString);
            var urlParams = {},
                e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) { return decodeURIComponent(s.replace(a, " ")); };

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
                qs = qs.substring(0, qs.length-1); //chop off last "&"
            }
            return qs;
        };

        return this;

    })();

    $(function(){
        var publishHeight = function() {
            HeightPublisher.publishHeight();
            window.setTimeout(publishHeight, 100);
        }
        publishHeight();
    });

    exports.HeightPublisher = HeightPublisher;

})(window, jQuery);