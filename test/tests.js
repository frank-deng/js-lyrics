QUnit.test("Basic Test", function(assert) {
	assert.deepEqual(
		Lyrics.parse(document.getElementById('sample').innerHTML)[0],
		{timestamp:27.540,text:'Ah! ほのかな予感から始まり'},
		"1st lyric"
	);
	assert.deepEqual(
		Lyrics.parse(document.getElementById('sample').innerHTML)[4],
		{timestamp:49.160,text:''},
		"1st lyric"
	);
	assert.equal(Lyrics.parse(document.getElementById('sample').innerHTML).length, 40, "40 Lines of LRC." );
});
QUnit.test("Timestamp Parsing", function(assert) {
	assert.deepEqual(Lyrics.parse('[0:0]ok')[0], {timestamp:0,text:'ok'}, "[0:0]");
	assert.deepEqual(Lyrics.parse('[0:00]ok')[0], {timestamp:0,text:'ok'}, "[0:00]");
	assert.deepEqual(Lyrics.parse('[00:00]ok')[0], {timestamp:0,text:'ok'}, "[00:00]");
	assert.deepEqual(Lyrics.parse('[00:00.0]ok')[0], {timestamp:0,text:'ok'}, "[00:00.0]");
	assert.deepEqual(Lyrics.parse('[00:00.00]ok')[0], {timestamp:0,text:'ok'}, "[00:00.00]");
	assert.deepEqual(Lyrics.parse('[2:20]ok')[0], {timestamp:140,text:'ok'}, "[2:20]");
	assert.deepEqual(Lyrics.parse('[2:2]ok')[0], {timestamp:122,text:'ok'}, "[2:2]");
	assert.deepEqual(Lyrics.parse('[2:20.1]ok')[0], {timestamp:140.1,text:'ok'}, "[2:20.1]");
	assert.deepEqual(Lyrics.parse('[2:2.2]ok')[0], {timestamp:122.2,text:'ok'}, "[2:2.2]");
	assert.deepEqual(Lyrics.parse('[2:00.2]ok')[0], {timestamp:120.2,text:'ok'}, "[2:00.2]");
	assert.deepEqual(Lyrics.parse('[2:00.02]ok')[0], {timestamp:120.02,text:'ok'}, "[2:00.02]");
	assert.deepEqual(Lyrics.parse('[2:00.002]ok')[0], {timestamp:120.002,text:'ok'}, "[2:00.002]");
	assert.deepEqual(Lyrics.parse('[2:00.1002]ok')[0], {timestamp:120.1002,text:'ok'}, "[2:00.1002]");
});
QUnit.test("Text Parsing", function(assert) {
	assert.equal(Lyrics.parse('[0:00.10]ok')[0].text, 'ok', "Normal text");
	assert.equal(Lyrics.parse('[0:00.10]  ok')[0].text, 'ok', "Space before");
	assert.equal(Lyrics.parse('[0:00.10]ok  ')[0].text, 'ok', "Space after");
	assert.equal(Lyrics.parse('[0:00.10]   ok  ')[0].text, 'ok', "Space at both side");
	assert.equal(Lyrics.parse('[0:00.10]ok\r')[0].text, 'ok', "CR character filtered");
	assert.equal(Lyrics.parse('  [0:00.10]ok')[0].text, 'ok', "Normal text with space before timestamp");
});
QUnit.test("Complex LRC Test", function(assert) {
	assert.deepEqual(
		Lyrics.parse(document.getElementById('sample').innerHTML),
		Lyrics.parse(document.getElementById('sample_complex').innerHTML),
		"Complex LRC parsed OK."
	);
});
QUnit.test("Abnormal data handling", function(assert) {
	assert.strictEqual(Lyrics.parse().length, 0, "No Parameter." );
	assert.strictEqual(Lyrics.parse('').length, 0, "Empty String." );
	assert.strictEqual(Lyrics.parse(null).length, 0, "Null Provided." );
	assert.strictEqual(Lyrics.parse(undefined).length, 0, "undefined Provided." );
	assert.strictEqual(Lyrics.parse(2348).length, 0, "Number Provided." );
	assert.strictEqual(Lyrics.parse(' \t ').length, 0, "String contains only spaces." );
	assert.deepEqual(Lyrics.parse(document.getElementById('abnormal').innerHTML), [{timestamp:190,text:'Normal'}], "Abnormal data filtered." );
});
QUnit.test("Custom hander", function(assert) {
	var result = Lyrics.parse(document.getElementById('sample').innerHTML);
	var result_custom = new Array();
	Lyrics.parse(document.getElementById('sample').innerHTML, function(ts,txt){
		result_custom.push({timestamp:ts, text:txt});
	});
	assert.deepEqual(result, result_custom, "OK");
});
QUnit.test("Storing data at DOM", function(assert) {
	var result = Lyrics.parse(document.getElementById('sample').innerHTML);
	var lyrics_container = document.getElementById('lyrics_container');
	Lyrics.parse(document.getElementById('sample').innerHTML, function(ts,text){
		var e = document.createElement('p');
		e.setAttribute('ts', ts);
		e.innerHTML = text;
		lyrics_container.appendChild(e);
	});
	var dom_lyrics = lyrics_container.getElementsByTagName('p');
	for(var i = 0; i < dom_lyrics.length; i++) {
		assert.strictEqual(Number(dom_lyrics[i].getAttribute('ts')), result[i].timestamp, 'Timestamp:' + result[i].timestamp);
		assert.strictEqual(dom_lyrics[i].innerHTML, result[i].text, 'Text:' + result[i].text);
	}
});
