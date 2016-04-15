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
		var result = new Array();
		if (!text_lrc) {
			return result;
		}
		var lines_all = String(text_lrc).split('\n');
		for (var i = 0; i < lines_all.length; i++) {
			var line = lines_all[i].replace(/(^\s*)|(\s*$)/g,'');
			if (!line) {
				continue;
			}
			var timestamp_all = Array();
			while (true) {
				var match = /^(\[\d+:\d+(.\d+)?\])(.*)/g.exec(line);
				if (match) {
					timestamp_all.push(match[1]);
					line = match[match.length-1].replace(/(^\s*)|(\s*$)/g,'');
				} else {
					break;
				}
			}
			for (var j = 0; j < timestamp_all.length; j++) {
				var ts_match = /^\[(\d{1,2}):(\d|[0-5]\d)(\.(\d+))?\]$/g.exec(timestamp_all[j]);
				if (ts_match) {
					result.push({
						timestamp:Number(ts_match[1])*60 + Number(ts_match[2]) + (ts_match[4] ? Number('0.'+ts_match[4]) : 0),
						text:line
					});
				}
			}
		}
		result.sort(function(a,b){
			return (a.timestamp > b.timestamp ? 1 : -1);
		});
		if (typeof(handler) == 'function'){
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

