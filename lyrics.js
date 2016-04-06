(function(){
	var _root = (function(){try{return this===window}catch(e){return false}})() ? window : global;
	_root.Lyrics = {
		parse : function(text_lrc, handler){
			var convertTimestamp = function(src) {
				var match = /^\[(\d{1,2}):(\d{1,2})(\.(\d{1,2}))?\]$/g.exec(src);
				if (!match) {
					return undefined;
				}
				var minute = Number(match[1]);
				var second = Number(match[2]);
				var millsec = Number(match[4]);
				var timestamp = minute * 60 + second;
				if (millsec) {
					timestamp += (millsec / 100);
				}
				return timestamp;
			}
			var lines_all = text_lrc.split('\n');
			var result = Array();
			for (var i = 0; i < lines_all.length; i++) {
				var line = lines_all[i].replace(/(^\s*)|(\s*$)/g, '');
				if (line.length > 0) {
					var match = Array(line);
					var timestamp_all = Array();
					var text = '';
					while (match) {
						match = /^(\[\d{1,2}:\d{1,2}(\.\d{1,2})?\])(.*)/g.exec(match[match.length-1]);
						if (match) {
							timestamp_all.push(match[1]);
							text = match[match.length-1];
						}
					}
					for (var j = 0; j < timestamp_all.length; j++) {
						result.push({timestamp:convertTimestamp(timestamp_all[j]), text:text});
					}
				}
			}
			if (!result.length) {
				return undefined;
			} else {
				result.sort(function(a,b){return (a.timestamp > b.timestamp ? 1 : -1);});
				for (var i = 0; i < result.length; i++) {
					if (handler) {
						handler.call(result, result[i].timestamp, result[i].text);
					}
				}
				return result;
			}
		},
		select : function(timestamp, source, converter){
			if (isNaN(timestamp)) {
				throw 'Invalid timestamp.';
			}
			for (var i = 0; i < source.length; i++) {
				var ts = (converter ? converter.call(source, source[i]) : source[i].timestamp);
				if (i < source.length - 1) {
					var ts_next = (converter ? converter.call(source, source[i+1]) : source[i+1].timestamp);
				}
				if (i == 0 && timestamp < ts) {
					return undefined;
				} else if (i == (source.length - 1) && ts <= timestamp) {
					return source[i];
				} else if (ts <= timestamp && ts_next > timestamp) {
					return source[i];
				}
			}
			return undefined;
		},
	}
})();

