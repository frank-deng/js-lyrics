<a name='english'></a>

js-lyrics
=========

[English](#english) | [中文](#chinese)

A JavaScript library for parsing LRC file, and select lyric to highlight.


Usage
-----

### Parse the content of a `.lrc` file

Load `.lrc` file while initializing parser:

	var lrc = new Lyrics(LRC_text);

Load `.lrc` file and replace previous loaded lyrics using the same parser object:

	lrc.load(LRC_text);


### Select lyric to highlight 

	Lyrics.select(time);

This method will return -1 when the time given is ahead the first lyric's time or `time` parameter is invalid.


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

Set time offset:

	Lyrics.setOffset(offset);

Get time offset;

	Lyrics.getOffset();

The time offset will be added to the value of `time` parameter when calling `Lyrics.select(time)` method.

Once `Lyrics.load()` method is called, the time offset will be reset to 0.


Test Cases
----------

You may launch `text.html` from `test/` folder using brwoser to see the result of all the [QUnit](http://qunitjs.com/) based test cases.


---


<a name='chinese'></a>

js-lyrics
=========

[English](#english) | [中文](#chinese)

一个用于解析LRC文件的JavaScript库，也用于选择需要高亮的歌词。


用法
----

### 解析`.lrc`文件

初始化解析器的同时加载`.lrc`文件中的内容：

	var lrc = new Lyrics(LRC_text);

加载`.lrc`文件中的内容，并替换之前加载的歌词：

	lrc.load(LRC_text);


### 选择需要高亮的歌词

	Lyrics.select(time);

当时间早于第1条歌词的时间，或`time`参数非法时，返回-1。


### 使用HTML5 audio标签同步歌词

	var lrc = new Lyrics(LRC_text);
	document.getElementById('audio_player').addEventListener('timeupdate', function(){
		//所有歌词取消高亮
		var lyric_selected = lyrics_container.querySelectorAll('[selected]');
		for (var i = 0; i < lyric_selected.length; i++) {
			lyric_selected[i].removeAttribute('selected');
		}

		//获取要高亮的歌词
		var lyric_selected = lrc.select(this.currentTime);

		//高亮歌词（如果有）
		if (lyric_selected != undefined && lyric_selected >= 0) {
			lyric_selected.setAttribute('selected', 'selected');
		}
	});


### 设置时间偏移

设置时间偏移量：

	Lyrics.setOffset(offset);

获取时间偏移量：

	Lyrics.getOffset();

当调用`Lyrics.select(time)`方法时，时间偏移量将被加到`time`参数的值上。

当`Lyrics.load()`被调用时，即新歌词被加载时，时间偏移量将被重置为0.


测试用例
--------

用浏览器打开`test/`目录下的`text.html`，可以查看[QUnit](http://qunitjs.com/)测试用例的运行结果。

