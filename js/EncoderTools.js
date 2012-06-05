(function (exports) {
    exports.EncoderTools = (function () {

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        this.utf8_encode = function (string) {
            var utfText = '', n, c, str;
            str = string.replace(/\r\n/g, "\n");
            for (n = 0; n < str.length; n += 1) {
                c = str.charCodeAt(n);
                if (c < 128) {
                    utfText += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utfText += String.fromCharCode((c >> 6) | 192);
                    utfText += String.fromCharCode((c & 63) | 128);
                } else {
                    utfText += String.fromCharCode((c >> 12) | 224);
                    utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                    utfText += String.fromCharCode((c & 63) | 128);
                }
            }
            return utfText;
        };

        this.utf8_decode = function (utfText) {
            var c = 0, c2 = 0, c3, string = '', i = 0;
            while (i < utfText.length) {
                c = utfText.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i += 1;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utfText.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utfText.charCodeAt(i + 1);
                    c3 = utfText.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        };

        this.base64_encode = function (input) {
            var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, str;
            str = this.utf8_encode(input);
            while (i < str.length) {
                chr1 = str.charCodeAt(i);
                i += 1;
                chr2 = str.charCodeAt(i);
                i += 1;
                chr3 = str.charCodeAt(i);
                i += 1;
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = 64;
                    enc4 = 64;
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
            var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, str;
            str = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < str.length) {
                enc1 = keyStr.indexOf(str.charAt(i));
                i += 1;
                enc2 = keyStr.indexOf(str.charAt(i));
                i += 1;
                enc3 = keyStr.indexOf(str.charAt(i));
                i += 1;
                enc4 = keyStr.indexOf(str.charAt(i));
                i += 1;
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output += String.fromCharCode(chr1);
                if (64 !== enc3) {
                    output += String.fromCharCode(chr2);
                }
                if (64 !== enc4) {
                    output += String.fromCharCode(chr3);
                }
            }
            return this.utf8_decode(output);
        };

        this.parseQueryString = function (queryString) {
            var qs = String(queryString),
                urlParams = {},
                e,
                a = /\+/g,  // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {
                    try {
                        var toDecode = s.replace(a, " ");
                        return decodeURIComponent(toDecode);
                    } catch (e) {
                        return "";
                    }
                },
                key;

            e = r.exec(qs);
            while (e) {
                if (e[2]) {
                    key = d(e[1]);
                    if (key) {
                        urlParams[key] = d(e[2]);
                    }
                }
                e = r.exec(qs);
            }
            return urlParams;
        };

        this.buildQueryString = function (parameters) {
            var qs = '', key, keyString, skipKey, i, len;

            for (key in parameters) {
                if (parameters.hasOwnProperty(key)) {
                    skipKey = false;
                    keyString = String(key);

                    for (i = 0, len = keyString.length; i < len; i += 1) {
                        if (255 < keyString.charCodeAt(i)) {
                            skipKey = true;
                            break;
                        }
                    }

                    if (skipKey) {
                        continue;
                    }

                    try {
                        qs += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
                    } catch (e) {
                        // in case strings couldn't be encoded
                        qs += "";
                    }
                }
            }

            if (0 < qs.length) {
                qs = qs.substring(0, qs.length - 1); //chop off last "&"
            }

            return qs;
        };

        this.buildHashParams = function (params) {
            var queryString = this.buildQueryString(params);
            return this.base64_encode(queryString);
        };

        this.parseHashParams = function (hash) {
            var decoded = this.base64_decode(hash);
            return this.parseQueryString(decoded);
        };

        return this;
    }());

}(window));