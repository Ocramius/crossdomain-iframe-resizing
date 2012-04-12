(function (exports, $) {

    var HeightPublisher = (function () {

        var currentFrameId = null;
        var cookieName = 'HeightPublisher';
        var cookieOptions = {
            expires:7,
            path:'/'
        };

        this.publish = function (params) {
            var hashParams = this.read();
            if (!hashParams['lastLocation']) {
                return false;
            }
            hashParams = $.extend({}, hashParams, params);
            var hashString = EncoderTools.buildHashParams(hashParams);
            $.cookie(cookieName, hashString, cookieOptions);
            window.parent.location = hashParams['lastLocation'] + '#' + hashString;
        };

        this.read = function () {
            var hashParams = EncoderTools.parseHashParams(window.location.hash.substring(1));
            if (!hashParams['lastLocation']) {
                hashParams = EncoderTools.parseHashParams($.cookie(cookieName) || "");
            }
            return hashParams;
        };

        this.publishHeight = function () {
            var frameId = getFrameId();
            if (!frameId) {
                return;
            }
            var actualHeight = getBodyHeight();
            var currentHeight = getViewPortHeight();
            if (Math.abs(actualHeight / currentHeight - 1) > 0.05) {
                this.publish({
                    height:actualHeight.toString()
                });
            }
        };

        var getFrameId = function () {
            var qs = this.read();
            var frameId = qs['frameId'];
            if (frameId) {
                currentFrameId = frameId;
            }
            return currentFrameId;
        };

        var getBodyHeight = function () {
            return $(document.body).outerHeight();
        };

        var getViewPortHeight = function () {
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

        return this;

    })();

    $(function () {
        var publishHeight = function () {
            HeightPublisher.publishHeight();
            window.setTimeout(publishHeight, 500);
        }
        publishHeight();
    });

    exports.HeightPublisher = HeightPublisher;

})(window, jQuery);