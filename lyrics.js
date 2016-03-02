(function(){
	var isBrowser = function(){try {return this===window;}catch(e){ return false;}}
	var _root = isBrowser() ? window : global;
	_root.Lyrics = function(text_lrc){
		var parse = function(text_lrc){
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
				throw 'Invalid LRC string.';
			} else {
				result.sort(function(a,b){return (a.timestamp > b.timestamp ? 1 : -1);});
				return result;
			}
		}
		var json_lrc = parse(text_lrc);

		this.select = function(timestamp){
			if (!json_lrc) {return undefined;}
			var i = 0;
			if (Number(timestamp) < json_lrc[0].timestamp) {
				return -1;
			}
			for (i = 0; i < (json_lrc.length - 1); i++) {
				if (json_lrc[i].timestamp <= Number(timestamp)
					&& json_lrc[i+1].timestamp > Number(timestamp)) {
					break;
				}
			}
			return i;
		}
		this.toJSON = function(){return json_lrc;}

		/*The following are for browser use only, if NodeJS environment is detected, exit now.*/
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
			if (!lyrics_container || !json_lrc) {
				return undefined;
			}
			var idx_next = this.select(timestamp);
			if (idx_next < 0 || (idx_now !== undefined && idx_next == idx_now)) {
				return false;
			}

			//Update lyric highlighted
			idx_now = idx_next;
			var lrc_elem = lyrics_container.querySelector('.lyric[selected]');
			if (lrc_elem) {
				lrc_elem.removeAttribute('selected');
			}
			lrc_elem = lyrics_container.querySelector('.lyric[idx="'+idx_next+'"]');
			if (lrc_elem) {
				lrc_elem.setAttribute('selected', 'selected');
			}
			return idx_now;
		}
	}
})();
