(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD support.
        define([], factory);
    } else if (typeof exports === 'object') {
        // NodeJS support.
        module.exports = factory();
    } else {
        // Browser global support.
        root.Lyrics = factory();
    }
}(this, function() {
    'use strict';
    var Lyrics = function (text_lrc) {
        /* Private */
        this.timestamp_offset = 0;
        this.lyrics_all = undefined;
        this.meta_info = undefined;
        this.ID_TAGS = [
            {name: 'artist', id: 'ar'},
            {name: 'album', id: 'al'},
            {name: 'title', id: 'ti'},
            {name: 'author', id: 'au'},
            {name: 'length', id: 'length'},
            {name: 'by', id: 'by'},
            {name: 'offset', id: 'offset', handler: this.setTimestampOffset},
            {name: 'createdBy', id: 're'},
            {name: 'createdByVersion', id: 've'}
        ];

        /* Initialization */
        for (var i = 0; i < this.ID_TAGS.length; i++) {
            this.ID_TAGS[i].re = new RegExp('\\[' + this.ID_TAGS[i].id + ':(.*)\\]$', 'g');
        }
        if (text_lrc) {
            this.load(text_lrc);
        }
    };


    Lyrics.prototype = {
        constructor: Lyrics,
        load: function (text_lrc) {
            this.lyrics_all = new Array();
            this.meta_info = new Object();
            this.timestamp_offset = 0;

            var lines_all = String(text_lrc).split('\n');
            for (var i = 0; i < lines_all.length; i++) {
                var line = lines_all[i].replace(/(^\s*)|(\s*$)/g, '');
                if (!line) {
                    continue;
                }

                //Parse ID Tags
                var is_id_tag = false;
                for (var j = 0; j < this.ID_TAGS.length; j++) {
                    var match = this.ID_TAGS[j].re.exec(line);
                    if (!match || match.length < 2) {
                        continue;
                    }

                    is_id_tag = true;
                    var value = match[1].replace(/(^\s*)|(\s*$)/g, '');
                    if (typeof this.ID_TAGS[j].handler == 'function') {
                        this.meta_info[String(this.ID_TAGS[j].name)] = this.ID_TAGS[j].handler.call(this, value);
                    } else {
                        this.meta_info[String(this.ID_TAGS[j].name)] = String(value);
                    }
                }
                if (is_id_tag) {
                    continue;
                }

                //Parse lyric
                var timestamp_all = Array();
                while (true) {
                    var match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(line);
                    if (match) {
                        timestamp_all.push(match[1]);
                        line = match[match.length - 1].replace(/(^\s*)|(\s*$)/g, '');
                    } else {
                        break;
                    }
                }
                for (var j = 0; j < timestamp_all.length; j++) {
                    var ts_match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.(\d+))?\]$/g.exec(timestamp_all[j]);
                    if (ts_match) {
                        this.lyrics_all.push({
                            timestamp: Number(ts_match[1]) * 60 + Number(ts_match[2]) + (ts_match[4] ? Number('0.' + ts_match[4]) : 0),
                            text: line
                        });
                    }
                }
            }

            this.lyrics_all.sort(function (a, b) {
                return (a.timestamp > b.timestamp ? 1 : -1);
            });
            if (!this.lyrics_all.length) {
                this.lyrics_all = undefined;
            }
            if (this.isEmpty(this.meta_info)) {
                this.meta_info = undefined;
            }
            return (this.lyrics_all !== undefined || this.meta_info !== undefined) ? true : false;
        },
        getLyrics: function () {
            return this.lyrics_all;
        },
        getLyric: function (idx) {
            try {
                return this.lyrics_all[idx];
            } catch (e) {
                return undefined;
            }
        },
        getIDTags: function () {
            return this.meta_info;
        },
        select: function (ts) {
            if (isNaN(ts)) {
                return -1;
            }
            var timestamp = Number(ts) + this.timestamp_offset;
            var i = 0;
            if (timestamp < this.lyrics_all[0].timestamp) {
                return -1;
            }
            for (i = 0; i < (this.lyrics_all.length - 1); i++) {
                if (this.lyrics_all[i].timestamp <= timestamp
                    && this.lyrics_all[i + 1].timestamp > timestamp) {
                    break;
                }
            }
            return i;
        },
        setTimestampOffset: function (offset) {
            this.timestamp_offset = isNaN(offset) ? 0 : Number(offset) / 1000;
            return Number(offset);
        },
        isEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }
            return true;
        }
    };
    return Lyrics;
}));