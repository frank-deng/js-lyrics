(function(){
	var root = this;
	var Lyrics = new Array();
	var previousLyrics = root.Lyrics;

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Lyrics;
		}
		exports.Lyrics = Lyrics;
	} else {
		root.Lyrics = Lyrics;
	}

	Lyrics.noConflict = function() {
		root.Lyrics = previousLyrics;
		return this;
	};
	Lyrics.parse = function(text_lrc, handler){
		var convertTimestamp = function(src) {
			var match = /^\[(\d{1,2}):(\d{1,2})(\.(\d+))?\]$/g.exec(src);
			if (!match) {
				return undefined;
			}
			var minute = Number(match[1]);
			var second = Number(match[2]);
			var timestamp = minute * 60 + second;
			if (match[4]){
				timestamp += Number('0.'+match[4]);
			}
			return timestamp;
		}

		var result = new Array();
		if (!text_lrc) {
			return result;
		}

		var lines_all = String(text_lrc).split('\n');
		for (var i = 0; i < lines_all.length; i++) {
			var line = lines_all[i].replace(/(^\s*)|(\s*$)/g,'');
			if (line.length > 0) {
				var match = Array(line);
				var timestamp_all = Array();
				var text = '';
				while (match) {
					match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(match[match.length-1]);
					if (match) {
						timestamp_all.push(match[1]);
						text = match[match.length-1];
					}
				}
				for (var j = 0; j < timestamp_all.length; j++) {
					var timestamp = convertTimestamp(timestamp_all[j]);
					if (timestamp !== undefined) {
						result.push({timestamp:timestamp, text:text.replace(/(^\s*)|(\s*$)/g,'')});
					}
				}
			}
		}
		result.sort(function(a,b){
			return (a.timestamp > b.timestamp ? 1 : -1);
		});
		if(typeof(handler) == 'function'){
			for (var i = 0; i < result.length; i++) {
					handler.call(result, result[i].timestamp, result[i].text);
			}
		}
		return result;
	}
	Lyrics.select = function(timestamp, source, converter){
		if (isNaN(timestamp)) {
			throw 'Invalid Timestamp';
		}
		for (var i = 0; i < source.length; i++) {
			var ts = Number(typeof(converter) == 'function' ? converter.call(source, source[i]) : source[i].timestamp);
			if (i < source.length - 1) {
				var ts_next = Number(typeof(converter) == 'function' ? converter.call(source, source[i+1]) : source[i+1].timestamp);
			}
			if (i == 0 && timestamp < ts) {
				return null;
			} else if (i == (source.length - 1) && ts <= timestamp) {
				return source[i];
			} else if (ts <= timestamp && ts_next > timestamp) {
				return source[i];
			}
		}
		return undefined;
	}
})();

