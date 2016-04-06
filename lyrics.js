(function(){
	var isBrowser = function(){try {return this===window;}catch(e){ return false;}}
	var _root = isBrowser() ? window : global;
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

			if (!handler) {
				handler = function(){};
			}

			var lines_all = text_lrc.split('\n');
			var result = Array();
			var lyrics_idx = 0;
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
				throw 'Failed to parse LRC string.';
			} else {
				result.sort(function(a,b){return (a.timestamp > b.timestamp ? 1 : -1);});
				for (var i = 0; i < result.length; i++) {
					handler.call(result, i, result[i].timestamp, result[i].text);
				}
				return result;
			}
		},
		select : function(timestamp, source, converter){
			if (isNaN(timestamp)) {
				throw 'Invalid timestamp.';
			}
			for (var i = 0; i < (source.length - 1); i++) {
				var ts = (converter ? converter.call(source, source[i]) : source[i].timestamp);
				var ts_next = (converter ? converter.call(source, source[i+1]) : source[i+1].timestamp);
				if (i == 0 && timestamp < ts) {
					return undefined;
				} else if (ts <= timestamp && ts_next > timestamp) {
					return source[i];
				}
			}
			return undefined;
		},

		/*The following are for browser use only, if NodeJS environment is detected, exit now.*/
		/*
		try {this===window;}catch(e){return;}

		var lyrics_container = undefined;
		var idx_now = undefined;
		this.bind = function(e){
			lyrics_container = e;
			e.innerHTML = '';
			for (var idx = 0; idx < json_lrc.length; idx++) {
				var lrc_line = document.createElement('p');
				lrc_line.setAttribute('class', 'lyric');
				lrc_line.setAttribute('idx', idx);
				if (json_lrc[idx].text.length > 0) {
					lrc_line.innerHTML = json_lrc[idx].text;
				} else {
					lrc_line.innerHTML = '&nbsp;';
				}
				e.appendChild(lrc_line);
			}
		}
		this.sync = function(timestamp){
			if (!lyrics_container) {
				throw 'Element for lyrics container is not specified using Lyrics.bind(elem).';
			}
			var idx_next = this.select(timestamp);
			if (idx_now !== undefined && idx_next == idx_now) {
				return false;
			}

			//Update lyric highlighted
			idx_now = idx_next;
			var lrc_elem = lyrics_container.querySelector('.lyric[selected]');
			if (lrc_elem) {
				lrc_elem.removeAttribute('selected');
			}
			if (idx_next >= 0) {
				lrc_elem = lyrics_container.querySelector('.lyric[idx="'+idx_next+'"]');
				if (lrc_elem) {
					lrc_elem.setAttribute('selected', 'selected');
				}
			}
			return idx_now;
		}
		*/
	}
})();
