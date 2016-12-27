<a name='english'></a>

js-lyrics
=========

[English](#english) | [中文](#chinese)

A JavaScript library for parsing LRC file, and select lyric to highlight.

Install
-------

You can install via **_npm_**:

	$ npm install lyrics.js

Or via Git reporsitory:

	$ git clone https://github.com/frank-deng/js-lyrics.git


Usage
-----

### Parse the content of a `.lrc` file

Load `.lrc` file while initializing parser:

	var lrc = new Lyrics(LRC_text);

Load `.lrc` file and replace previous loaded lyrics using the same parser object:

	lrc.load(LRC_text);

**PS**: To specify time offset for `.lrc` file, please add the following tag into your `.lrc` file:

	[offset:t]

`t` is time offset in milliseconds, positive value to shift time up, negative value to shift time down.


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


Test Cases
----------

You may launch `text.html` and `test.min.html` from `test/` folder using brwoser to see the result of all the [QUnit](http://qunitjs.com/) based test cases.


---


<a name='chinese'></a>

js-lyrics
=========

[English](#english) | [中文](#chinese)

一个用于解析LRC文件的JavaScript库，也用于选择需要高亮的歌词。

安装
----

使用**_npm_**安装：

	$ npm install lyrics.js

从Git仓库安装：

	$ git clone https://github.com/frank-deng/js-lyrics.git


用法
----

### 解析`.lrc`文件

初始化解析器的同时加载`.lrc`文件中的内容：

	var lrc = new Lyrics(LRC_text);

加载`.lrc`文件中的内容，并替换之前加载的歌词：

	lrc.load(LRC_text);

**PS**：如果需要为`.lrc`指定时间偏移量，请在`.lrc`文件中加上如下标签：

	[offset:t]

`t`为时间偏移量，单位为毫秒，正数为延后，负数为提前。


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


测试用例
--------

用浏览器打开`test/`目录下的`test.html`和`test.min.html`，可以查看[QUnit](http://qunitjs.com/)测试用例的运行结果。

