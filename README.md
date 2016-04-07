js-lyrics
=========

A JavaScript library handling LRC file.

Usage
-----

### Loading In Browser

	<script type="text/javascript" src="lyrics.min.js"></script>

### Parse .lrc File

	Lyrics.parse(text_lrc, handler);

* `text_lrc`: Content of a .lrc file.
* `handler`: Function used to process each pair of timestamp and lyric.

### Get Lyric To Show

	Lyrics.select(timestamp, lyrics_array, time_handler);

* `timestamp`: Timestamp in seconds, used to determine which lyric to show. Decimal number is acceptable.
* `lyrics_array`: Array contains elements of lyric data. Each element contains timestamp data which is extracted by function `time_handler`. Elements in the array must be sorted by timestamp data in ascending order.
* `time_handler`: Function for extracting timestamp data from each lyric data in `lyrics_array`, which should return the timestamp value extracted in decimal number type. 

Example
-------

	/** Parse .lrc file and put lyrics as well as timestamp data accordingly into HTML DOM. */
	var lyrics_container = document.getElementById('lyrics_container');
	Lyrics.parse(document.getElementById('text_lyrics').innerHTML, function(timestamp, text){
		var lyric_element = document.createElement('p');
		lyric_element.setAttribute('timestamp', timestamp);
		lyric_element.innerHTML = text;
		lyrics_container.appendChild(lyric_element);
	});

	/** Synchoronize lyrics with HTML5 audio element */
	var lyrics_all = lyrics_container.getElementsByTagName('p');
	document.getElementById('audio_player').addEventListener('timeupdate', function(){
		//Unhighlight all the lyrics
		var lyric_selected = lyrics_container.querySelectorAll('[selected]');
		for (var i = 0; i < lyric_selected.length; i++) {
			lyric_selected[i].removeAttribute('selected');
		}

		//Get the lyric to highlight
		var lyric_selected = Lyrics.select(this.currentTime, lyrics_all, function(e){
			return Number(e.getAttribute('timestamp'));
		});

		//Highlight the lyric if available
		if (lyric_selected) {
			lyric_selected.setAttribute('selected', 'selected');
		}
	});

