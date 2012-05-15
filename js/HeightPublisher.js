(function (window, exports, $, EncoderTools) {

    var heightPublisher = (function () {

        /** @type {Number}|null frame id for this frame */
        var currentFrameId = null,

            /** @type {String} Name of the cookie storing the latest parameters */
            cookieName = 'HeightPublisher',

            /** @type {Object} Persistence options for the cookie */
            cookieOptions = {
                expires: 7,
                path: '/'
            },

            /**
             * Retrieves the body height
             *
             * @return {Number}
             */
            getBodyHeight = function () {
                return $(window.document.body).outerHeight();
            },

            /**
             * Retrieves the viewport height
             *
             * @return {Number}
             */
            getViewPortHeight = function () {
                var height = 0;
                if (window.innerHeight) {
                    height = window.innerHeight - 18;
                } else if (
                    window.document.documentElement &&
                        window.document.documentElement.clientHeight
                ) {
                    height = window.document.documentElement.clientHeight;
                } else if (window.document.body && window.document.body.clientHeight) {
                    height = window.document.body.clientHeight;
                }
                return height;
            };

        this.getHashParams = function (params) {
            var parameters = params || {};
            return EncoderTools.buildHashParams($.extend({}, this.read(), parameters));
        };

        /**
         * Handles basic publishing of arbitrary objects to the parent window
         *
         * @param params Object
         * @return {Boolean} true on success
         */
        this.publish = function (params) {
            var hashString,
                hashParams = this.read(),
                parameters = params || {};
            if (!hashParams.lastLocation) {
                return false;
            }
            hashString = this.getHashParams(parameters);
            if (!hashString) {
                return false;
            }
            $.cookie(cookieName, hashString, cookieOptions);
            window.parent.location = hashParams.lastLocation + '#' + hashString;
            return true;
        };

        /**
         * Retrieves hash parameter passed to this window or stored in cookie
         *
         * @return Object
         */
        this.read = function () {
            var hashParams = EncoderTools.parseHashParams(window.location.hash.substring(1));
            if (!hashParams.lastLocation) {
                hashParams = EncoderTools.parseHashParams($.cookie(cookieName) || "");
            }
            return hashParams;
        };

        /**
         * Sends the current height to the parent window via hash parameters
         */
        this.publishHeight = function () {
            var actualHeight, currentHeight, frameId = this.getFrameId();
            if (!frameId) {
                return;
            }
            actualHeight = getBodyHeight();
            currentHeight = getViewPortHeight();
            if (Math.abs(actualHeight / currentHeight - 1) > 0.05) {
                this.publish({
                    height: actualHeight.toString()
                });
            }
        };

        /**
         * Retrieves the current frame id (frame id is assigned by parent window)
         *
         * @return {Number}|null
         */
        this.getFrameId = function () {
            var qs = this.read();
            if (qs.frameId) {
                currentFrameId = qs.frameId;
            }
            return currentFrameId;
        };

        return this;

    }());

    $(function () {

        // Sending height publish notifications to parent window
        var publishHeight = function () {
            heightPublisher.publishHeight();
            window.setTimeout(publishHeight, 500);
        };
        // First publishing is delayed in case parent window isn't ready yet
        window.setTimeout(publishHeight, 500);

        // Propagating hash parameters through pages
        $("a").live(
            "click",
            function (e) {
                var a = $(this),
                    href = a.attr('href'),
                    target = !a.attr('target') || (a.attr('target') === '_self'),
                    params = heightPublisher.getHashParams(),
                    hasHash = href && (href.indexOf("#") >= 0);
                if (!hasHash && params && target) {
                    e.preventDefault();
                    window.document.location.href = href +  "#" + params;
                }
            }
        );

    });

    exports.HeightPublisher = heightPublisher;

}(window, window, jQuery, EncoderTools));