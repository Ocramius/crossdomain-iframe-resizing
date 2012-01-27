(function(exports, $){

    var HeightPublisher = (function() {
        this.publishHeight = function() {
            if (window.location.hash.length == 0) return;
            var frameId = getFrameId();
            if (frameId == '') {
                return;
            }
            var actualHeight = getBodyHeight();
            var currentHeight = getViewPortHeight();
            if  (Math.abs(actualHeight/currentHeight - 1) > 0.05) {
                window.top.location = window.location.hash.substring(1)
                    + "#"
                    + 'frameId=' + frameId
                    + '&'
                    + 'height=' + actualHeight.toString();
            }
        };

        var getFrameId = function() {
            var qs = parseQueryString(window.location.href);
            var frameId = qs['frameId'];
            var hashIndex = frameId.indexOf('#');
            if (hashIndex > -1) {
                frameId = frameId.substring(0, hashIndex);
            }
            return frameId;
        }

        var getBodyHeight = function() {
            var height,
                scrollHeight,
                offsetHeight;
            if (document.height) {
                height = document.height;
            } else if (document.body) {
                if (document.body.scrollHeight) {
                    height = scrollHeight = document.body.scrollHeight;
                }
                if (document.body.offsetHeight) {
                    height = offsetHeight = document.body.offsetHeight;
                }
                if (scrollHeight && offsetHeight) {
                    height = Math.max(scrollHeight, offsetHeight);
                } else {
                    height = $(document.body).height();
                }
                if (!height) {
                    height = $(document).height();
                }
            }
            return height;
        }

        var getViewPortHeight = function() {
            var height = 0;
            if (window.innerHeight) {
                height = window.innerHeight - 18;
            } else if ((document.documentElement) && (document.documentElement.clientHeight)) {
                height = document.documentElement.clientHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                height = document.body.clientHeight;
            }
            return height;
        }

        var parseQueryString = function(url) {
            url = new String(url);
            var queryStringValues = new Object(),
                querystring = url.substring((url.indexOf('?') + 1), url.length),
                querystringSplit = querystring.split('&');
            for (i = 0; i < querystringSplit.length; i++) {
                var pair = querystringSplit[i].split('='),
                    name = pair[0],
                    value = pair[1];
                queryStringValues[name] = value;
            }
            return queryStringValues;
        }

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