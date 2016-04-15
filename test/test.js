function htmlspecialchars(s){
	var M={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
	return s.replace(/[&<>"']/g,function(m){return M[m]});
}
function CustomError( message ) {
	this.message = message;
}
QUnit.test("Basic Test", function(assert) {
	assert.deepEqual(Lyrics.parse(document.getElementById('sample').innerHTML)[0], {timestamp:27.540,text:'Ah! ほのかな予感から始まり'});
	assert.deepEqual(Lyrics.parse(document.getElementById('sample').innerHTML)[4], {timestamp:49.160,text:''});
	assert.equal(Lyrics.parse(document.getElementById('sample').innerHTML).length, 40);
});
QUnit.test("Timestamp Parsing", function(assert) {
	assert.deepEqual(Lyrics.parse('[0:0]ok')[0], {timestamp:0,text:'ok'});
	assert.deepEqual(Lyrics.parse('[0:00]ok')[0], {timestamp:0,text:'ok'});
	assert.deepEqual(Lyrics.parse('[00:00]ok')[0], {timestamp:0,text:'ok'});
	assert.deepEqual(Lyrics.parse('[00:00.0]ok')[0], {timestamp:0,text:'ok'});
	assert.deepEqual(Lyrics.parse('[00:00.00]ok')[0], {timestamp:0,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:20]ok')[0], {timestamp:140,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:2]ok')[0], {timestamp:122,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:20.1]ok')[0], {timestamp:140.1,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:2.2]ok')[0], {timestamp:122.2,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:00.2]ok')[0], {timestamp:120.2,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:00.02]ok')[0], {timestamp:120.02,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:00.002]ok')[0], {timestamp:120.002,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:00.1002]ok')[0], {timestamp:120.1002,text:'ok'});
	assert.deepEqual(Lyrics.parse('[2:00.12] \t [2:10.12]ok'), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
	assert.deepEqual(Lyrics.parse('   [2:00.12]  [2:10.12]ok'), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
	assert.deepEqual(Lyrics.parse('   [2:00.12]  [2:10.12]   ok'), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
});
QUnit.test("Text Parsing", function(assert) {
	assert.equal(Lyrics.parse('[0:00.10]ok')[0].text, 'ok', "Normal text");
	assert.equal(Lyrics.parse('[0:00.10]  ok')[0].text, 'ok', "Space before");
	assert.equal(Lyrics.parse('[0:00.10]ok  ')[0].text, 'ok', "Space after");
	assert.equal(Lyrics.parse('[0:00.10]   ok  ')[0].text, 'ok', "Space at both side");
	assert.equal(Lyrics.parse('[0:00.10]ok\r')[0].text, 'ok', "CR character");
	assert.equal(Lyrics.parse('  [0:00.10]ok')[0].text, 'ok', "Normal text with space before timestamp");
});
QUnit.test("Complex LRC Test", function(assert) {
	assert.deepEqual(
		Lyrics.parse(document.getElementById('sample').innerHTML),
		Lyrics.parse(document.getElementById('sample_complex').innerHTML),
		"Complex LRC parsed OK."
	);
});
QUnit.test("Filtering Invalid Data", function(assert) {
	assert.strictEqual(Lyrics.parse().length, 0, "No Parameter." );
	assert.strictEqual(Lyrics.parse('').length, 0, "Empty String." );
	assert.strictEqual(Lyrics.parse(null).length, 0, "Null Provided." );
	assert.strictEqual(Lyrics.parse(undefined).length, 0, "undefined Provided." );
	assert.strictEqual(Lyrics.parse(2348).length, 0, "Number Provided." );
	assert.strictEqual(Lyrics.parse(' \t ').length, 0, "String contains only spaces." );
	assert.strictEqual(Lyrics.parse('[0:80.0]Invalid Timetamp').length, 0, "Invalid Timestamp" );
	assert.strictEqual(Lyrics.parse('[0:80]Invalid Timetamp').length, 0, "Invalid Timestamp" );
	assert.strictEqual(Lyrics.parse('[0:80.05]Invalid Timetamp').length, 0, "Invalid Timestamp" );
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
	lyrics_container.innerHTML = '';
	Lyrics.parse(document.getElementById('sample').innerHTML, function(ts,text){
		var e = document.createElement('p');
		e.setAttribute('ts', ts);
		e.innerHTML = text;
		lyrics_container.appendChild(e);
	});
	var dom_lyrics = lyrics_container.getElementsByTagName('p');
	for(var i = 0; i < dom_lyrics.length; i++) {
		assert.strictEqual(Number(dom_lyrics[i].getAttribute('ts')), result[i].timestamp);
		assert.strictEqual(dom_lyrics[i].innerHTML, htmlspecialchars(result[i].text));
	}
});
QUnit.test("Select Lyric", function(assert) {
	var lyric_data = Lyrics.parse(document.getElementById('sample').innerHTML);
	assert.strictEqual(Lyrics.select(0, lyric_data), null);
	assert.strictEqual(Lyrics.select(0.1, lyric_data), null);
	assert.strictEqual(Lyrics.select(0.2, lyric_data), null);
	assert.strictEqual(Lyrics.select(27.53, lyric_data), null);
	assert.deepEqual(Lyrics.select(27.54, lyric_data), {timestamp:27.54,text:'Ah! ほのかな予感から始まり'});
	assert.deepEqual(Lyrics.select('27.55', lyric_data), {timestamp:27.54,text:'Ah! ほのかな予感から始まり'});
	assert.deepEqual(Lyrics.select(33, lyric_data), {timestamp:32.97,text:'Ah! 希望が星空駈けて'});
	assert.deepEqual(Lyrics.select(166, lyric_data), {timestamp:165.37,text:'光を追いかけてきた僕たちだから'});
	assert.deepEqual(Lyrics.select(272, lyric_data), {timestamp:271.52,text:'Ah! ほのかな予感から始まり'});
	assert.deepEqual(Lyrics.select(278, lyric_data), {timestamp:277.41,text:'Ah! 光を追いかけてきたんだよ…'});
	assert.deepEqual(Lyrics.select(300, lyric_data), {timestamp:288.41,text:''});
	assert.raises(function(){
		try {
			Lyrics.select('s300al', lyric_data);
		} catch (e) {
			throw new CustomError(String(e));
		}
	}, /Invalid Timestamp/, 'Invalid Timestamp Test');
});
QUnit.test("Select Lyric From Dom", function(assert) {
	var lyrics_container = document.getElementById('lyrics_container');
	lyrics_container.innerHTML = '';
	Lyrics.parse(document.getElementById('sample').innerHTML, function(ts,text){
		var e = document.createElement('p');
		e.setAttribute('ts', ts);
		e.innerHTML = text;
		lyrics_container.appendChild(e);
	});
	var lyric_data = lyrics_container.getElementsByTagName('p');
	var handler = function(e){
		return e.getAttribute('ts');
	}
	assert.strictEqual(Lyrics.select(0, lyric_data, handler), null);
	assert.strictEqual(Lyrics.select(0.1, lyric_data, handler), null);
	assert.strictEqual(Lyrics.select(0.2, lyric_data, handler), null);
	assert.strictEqual(Lyrics.select(27.53, lyric_data, handler), null);
	assert.strictEqual(Lyrics.select(27.54, lyric_data, handler), lyric_data[0]);
	assert.strictEqual(Lyrics.select('27.55', lyric_data, handler), lyric_data[0]);
	assert.strictEqual(Lyrics.select(33, lyric_data, handler), lyric_data[1]);
	assert.strictEqual(Lyrics.select(166, lyric_data, handler), lyric_data[22]);
	assert.strictEqual(Lyrics.select(272, lyric_data, handler), lyric_data[37]);
	assert.strictEqual(Lyrics.select(278, lyric_data, handler), lyric_data[38]);
	assert.strictEqual(Lyrics.select(300, lyric_data, handler), lyric_data[39]);
	assert.raises(function(){
		try {
			Lyrics.select('s300al', lyric_data, handler);
		} catch (e) {
			throw new CustomError(String(e));
		}
	}, /Invalid Timestamp/, 'Invalid Timestamp Test');
});

