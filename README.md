js-lyrics
=========

A JavaScript library for parsing LRC file, and select lyric to highlight.


Usage
-----

### Parse the content of a `.lrc` file:

	var lrc = new Lyrics(LRC_text);

or

	lrc.load(LRC_text);	//This will replace the previous loaded lyrics.


### Select lyric to highlight 

	Lyrics.select(time);

This method will return -1 when the time is ahead the first lyric's time or time parameter is not a number.


### Synchoronize lyrics with HTML5 audio element

	var lrc = new Lyrics(LRC_text);
	document.getElementById('audio_player').addEventListener('timeupdate', function(){
		//Unhighlight all the lyrics
		var lyric_selected = lyrics_container.querySelectorAll('[selected]');
		for (var i = 0; i < lyric_selected.length; i++) {
			lyric_selected[i].removeAttribute('selected');
		}

		//Get the lyric to highlight
		var lyric_selected = lrc.select(this.currentTime);

		//Highlight the lyric
		if (lyric_selected != undefined && lyric_selected >= 0) {
			lyric_selected.setAttribute('selected', 'selected');
		}
	});


### Specify time offset

Set time offset

	Lyrics.setOffset(offset);

Get time offset

	Lyrics.getOffset();

The time offset will be added to the value of `time` parameter when calling `Lyrics.select(time)` method.

Once `Lyrics.load()` method is called, the time offset will be reset to 0.


Test Cases
----------

You may launch `text.html` from `test/` folder using brwoser to see the result of all the [QUnit](http://qunitjs.com/) based test cases.

