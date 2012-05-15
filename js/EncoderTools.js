(function (exports) {

    var encoderTools = (function () {

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        this.utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = '', n, c;
            for (n = 0; n < string.length; n += 1) {
                c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };

        this.utf8_decode = function (utftext) {
            var c, c1, c2, c3, string = '', i = 0;
            c = c1 = c2 = 0;
            while (i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i += 1;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        };

        this.base64_encode = function (input) {
            var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
            input = this.utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i);
                i += 1;
                chr2 = input.charCodeAt(i);
                i += 1;
                chr3 = input.charCodeAt(i);
                i += 1;
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        };

        this.base64_decode = function (input) {
            var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < input.length) {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this.utf8_decode(output);
            return output;
        };

        this.parseQueryString = function (queryString) {
            queryString = new String(queryString);
            var urlParams = {},
                e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {return decodeURIComponent(s.replace(a, " "));};
            while (e = r.exec(queryString)) {
                if (e[2]) {
                    urlParams[d(e[1])] = d(e[2]);
                }
            }
            return urlParams;
        };

        this.buildQueryString = function(parameters) {
            var qs = '', key, keyString, skipKey, i, len;

            for (key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    skipKey = false;
                    keyString = String(key);

                    for (i = 0, len = keyString.length; i < len; i += 1) {
                        if (keyString.charCodeAt(i) > 255) {
                            skipKey = true;
                            break;
                        }
                    }

                    if (skipKey) {
                        continue;
                    }

                    qs += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
                }
            }

            if (0 < qs.length){
                qs = qs.substring(0, qs.length - 1); //chop off last "&"
            }

            return qs;
        };

        this.buildHashParams = function(params) {
            return this.base64_encode(this.buildQueryString(params));
        };

        this.parseHashParams = function(hash) {
            return this.parseQueryString(this.base64_decode(hash));
        };

        return this;
    })();

    exports.EncoderTools = encoderTools;

})(window);