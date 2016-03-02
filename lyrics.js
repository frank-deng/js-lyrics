(function(){
	var isBrowser = function(){try {return this===window;}catch(e){ return false;}}
	var _root = isBrowser() ? window : global;
	_root['Lyric'] = function(text_lrc, lyrics_container){
		this.parse = function(text_lrc){
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

			text_lrc = text_lrc.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
			var lines_all = text.split('\n');
			var result = Array();
			var lyrics_idx = 0;
			var r_lyric_start = /^(\[\d{1,2}:\d{1,2}(\.\d{1,2})?\])(.*)/g;
			for (var i = 0; i < lines_all.length; i++) {
				var line = lines_all[i].replace(/(^\s*)|(\s*$)/g, '');
				if (line.length > 0 && r_lyric_start.test(line)) {
					var match = Array(line);
					var timestamp_all = Array();
					var text = '';
					while (match) {
						match = r_lyric_start.exec(match[match.length-1]);
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
		this.select = function(timestamp){
			var i = 0;
			if (Number(timestamp) < data[0].timestamp) {
				return -1;
			}
			for (i = 0; i < (data.length - 1); i++) {
				if (data[i].timestamp <= Number(timestamp)
					&& data[i+1].timestamp > Number(timestamp)) {
					break;
				}
			}
			return i;
		}
		var json_lrc = this.parse(text_lrc);
		this.toJSON = function(){return json_lrc;}

		/*The following are for browser use only, if NodeJS environment is detected, exit now.*/
		try {this===window;}catch(e){return;}

		var lyrics_container = lyrics_container;
		var idx_now = undefined;
		this.bind = function(lyrics_container){
			lyrics_container.innerHTML = '';
			for (var idx = 0; idx < data.length; idx++) {
				var lrc_line = document.createElement('p');
				lrc_line.setAttribute('class', 'lyric');
				lrc_line.setAttribute('idx', idx);
				if (data[idx].text.length > 0) {
					lrc_line.innerHTML = data[idx].text;
				} else {
					lrc_line.innerHTML = '&nbsp;';
				}
				lyrics_container.appendChild(lrc_line);
			}
		}
		this.sync = function(timestamp){
			if (!lyrics_container) {
				return;
			}
			var idx_next = this.select(timestamp);
			if (idx_now !== undefined && idx_next == idx_now) {
				return;
			}

			//Update lyric highlighted
			idx_now = idx_next;
			var lrc_elem = lyrics_container.querySelector('[selected]');
			if (lrc_elem) {
				lrc_elem.removeAttribute('selected');
			}
			lrc_elem = lyrics_container.querySelector('[idx='+idx_next+']');
			if (lrc_elem) {
				lrc_elem.setAttribute('selected', 'selected');
			}
		}

		if (lyrics_container) {
			this.bind(lyrics_container);
		}
	}
})();
