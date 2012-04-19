(function (exports, $) {

    var HeightPublisher = (function () {

        /**
         * @type {Number}|null frame id for this frame
         */
        var currentFrameId = null;

        /**
         * @type {String} Name of the cookie storing the latest parameters
         */
        var cookieName = 'HeightPublisher';

        /**
         * @type {Object} Persistence options for the cookie
         */
        var cookieOptions = {
            expires: 7,
            path: '/'
        };

        this.getHashParams = function (params) {
            params = params || {};
            return EncoderTools.buildHashParams($.extend({}, this.read(), params));
        };

        /**
         * Handles basic publishing of arbitrary objects to the parent window
         *
         * @param params Object
         * @return {Boolean} true on success
         */
        this.publish = function (params) {
            params = params || {};
            var hashParams = this.read();
            if (!hashParams['lastLocation']) {
                return false;
            }
            var hashString = this.getHashParams(params);
            if(!hashString) {
                return false;
            }
            $.cookie(cookieName, hashString, cookieOptions);
            window.parent.location = hashParams['lastLocation'] + '#' + hashString;
            return true;
        };

        /**
         * Retrieves hash parameter passed to this window or stored in cookie
         *
         * @return Object
         */
        this.read = function () {
            var hashParams = EncoderTools.parseHashParams(window.location.hash.substring(1));
            if (!hashParams['lastLocation']) {
                hashParams = EncoderTools.parseHashParams($.cookie(cookieName) || "");
            }
            return hashParams;
        };

        /**
         * Sends the current height to the parent window via hash parameters
         */
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

        /**
         * Retrieves the current frame id (frame id is assigned by parent window)
         *
         * @return {Number}|null
         */
        var getFrameId = function () {
            var qs = this.read();
            if (qs['frameId']) {
                currentFrameId = qs['frameId'];
            }
            return currentFrameId;
        };

        /**
         * Retrieves the body height
         *
         * @return {Number}
         */
        var getBodyHeight = function () {
            return $(document.body).outerHeight();
        };

        /**
         * Retrieves the viewport height
         *
         * @return {Number}
         */
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

        // Sending height publish notifications to parent window
        var publishHeight = function () {
            HeightPublisher.publishHeight();
            window.setTimeout(publishHeight, 500);
        };
        // First publishing is delayed in case parent window isn't ready yet
        window.setTimeout(publishHeight, 500);

        // Propagating hash parameters through pages
        $("a").live(
            "click",
            function(e) {
                var $a = $(this);
                var href = $a.attr('href');
                var params = HeightPublisher.getHashParams();
                if (
                    href
                    && params
                    && (href.indexOf("#") < 0)
                ) {
                    e.preventDefault();
                    document.location.href = href +  "#" + params;
                }
            }
        );

    });

    exports.HeightPublisher = HeightPublisher;

})(window, jQuery);