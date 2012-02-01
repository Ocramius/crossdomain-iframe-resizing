(function(exports, $) {

    var HeightPublisher = (function() {

        var lastLocation = '';
        var currentFrameId = null;
        
        this.publishHeight = function() {
            if (window.location.hash.length == 0) return;
            var frameId = getFrameId();
            if (frameId == '') {
                return;
            }
            var actualHeight = getBodyHeight();
            var currentHeight = getViewPortHeight();
            if  (Math.abs(actualHeight/currentHeight - 1) > 0.05) {
                var params = EncoderTools.parseHashParams(window.location.hash.substring(1));
                if(
                    typeof params['lastLocation'] != 'undefined'
                    && params['lastLocation']
                ) {
                    lastLocation = params['lastLocation'];
                }
                if (lastLocation != '') {
                    params['lastLocation'] = lastLocation;
                    params['frameId'] = frameId;
                    params['height'] = actualHeight.toString();
                    window.parent.location = lastLocation + '#' + EncoderTools.buildHashParams(params);
                }
            }
        };

        var getFrameId = function() {
            var qs = EncoderTools.parseHashParams(window.location.hash.substring(1));
            var frameId = qs['frameId'];
            if(frameId) {
                currentFrameId = frameId;
            }
            return currentFrameId;
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

        return this;

    })();

    $(function(){
        var publishHeight = function() {
            HeightPublisher.publishHeight();
            window.setTimeout(publishHeight, 500);
        }
        publishHeight();
    });

    exports.HeightPublisher = HeightPublisher;

})(window, jQuery);