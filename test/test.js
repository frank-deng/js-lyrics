function htmlspecialchars(s){
	var M={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
	return s.replace(/[&<>"']/g,function(m){return M[m]});
}
function CustomError( message ) {
	this.message = message;
}
QUnit.test("Basic Test", function(assert) {
	var lrcParser = new Lyrics(sample);
	assert.deepEqual(lrcParser.getLyric(0), {timestamp:27.540,text:'Ah! ほのかな予感から始まり'});
	assert.deepEqual(lrcParser.getLyric(4), {timestamp:49.160,text:''});
	assert.strictEqual(lrcParser.getLyric(-1), undefined);
	assert.strictEqual(lrcParser.getLyric(41), undefined);
	assert.equal(lrcParser.getLyrics().length, 40);
	assert.deepEqual(lrcParser.getIDTags(), {artist:'μ\'s',title:'僕たちはひどつの光'}, 'Parsing ID Tags');
});
QUnit.test("Timestamp Parsing", function(assert) {
	var parser = new Lyrics();
	parser.load('[0:0]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:0,text:'ok'});
	assert.deepEqual(parser.getIDTags(), undefined, 'No ID tags loaded');
	parser.load('[0:00]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:0,text:'ok'});
	parser.load('[00:00]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:0,text:'ok'});
	parser.load('[00:00.0]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:0,text:'ok'});
	parser.load('[00:00.00]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:0,text:'ok'});
	parser.load('[2:20]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:140,text:'ok'});
	parser.load('[2:2]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:122,text:'ok'});
	parser.load('[2:20.1]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:140.1,text:'ok'});
	parser.load('[2:2.2]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:122.2,text:'ok'});
	parser.load('[2:00.2]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:120.2,text:'ok'});
	parser.load('[2:00.02]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:120.02,text:'ok'});
	parser.load('[2:00.002]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:120.002,text:'ok'});
	parser.load('[2:00.1002]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:120.1002,text:'ok'});
	parser.load('[1:59]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:119,text:'ok'});
	parser.load('[1:59.3]ok');
	assert.deepEqual(parser.getLyrics()[0], {timestamp:119.3,text:'ok'});
	parser.load('[2:00.12] \t [2:10.12]ok');
	assert.deepEqual(parser.getLyrics(), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
	parser.load('   [2:00.12]  [2:10.12]ok');
	assert.deepEqual(parser.getLyrics(), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
	parser.load('   [2:00.12]  [2:10.12]   ok');
	assert.deepEqual(parser.getLyrics(), [
		{timestamp:120.12,text:'ok'},
		{timestamp:130.12,text:'ok'},
	]);
});
QUnit.test("Text Parsing", function(assert) {
	var parser = new Lyrics();
	assert.strictEqual(parser.load('[0:00.10]ok'), true, "LRC loaded." );
	assert.equal(parser.getLyric(0).text, 'ok', "Normal text");
	parser.load('[0:00.10]  ok');
	assert.equal(parser.getLyric(0).text, 'ok', "Space before");
	parser.load('[0:00.10]ok  ');
	assert.equal(parser.getLyric(0).text, 'ok', "Space after");
	parser.load('[0:00.10]   ok  ');
	assert.equal(parser.getLyric(0).text, 'ok', "Space at both side");
	parser.load('[0:00.10]ok\r');
	assert.equal(parser.getLyric(0).text, 'ok', "CR character");
	parser.load('  [0:00.10]ok');
	assert.equal(parser.getLyric(0).text, 'ok', "Normal text with space before timestamp");
});
QUnit.test("Complex LRC Test", function(assert) {
	var lrc1 = new Lyrics(sample);
	var lrc2 = new Lyrics(sample_complex);
	assert.deepEqual(
		lrc1.getLyrics(),
		lrc2.getLyrics(),
		"Complex LRC parsed OK."
	);
});
QUnit.test("Filtering Invalid Data", function(assert) {
	var parser = new Lyrics();
	assert.strictEqual(parser.getLyrics(), undefined, "LRC not loaded." );
	var parser = new Lyrics();
	assert.strictEqual(parser.load(), false, "LRC not loaded via load()." );
	assert.strictEqual(parser.getLyrics(), undefined, "LRC not loaded via load()." );
	assert.strictEqual(parser.getIDTags(), undefined, "LRC not loaded via load()." );
	assert.strictEqual(parser.load(''), false, "Empty String." );
	assert.strictEqual(parser.load(null), false, "Null Provided." );
	assert.strictEqual(parser.load(undefined), false, "undefined Provided." );
	assert.strictEqual(parser.load(2348), false, "Number Provided." );
	assert.strictEqual(parser.load(' \t '), false, "String contains only spaces." );
	assert.strictEqual(parser.load('[0:80.0]Invalid Timetamp'), false, "Invalid Timestamp" );
	assert.strictEqual(parser.load('[0:80]Invalid Timetamp'), false, "Invalid Timestamp" );
	assert.strictEqual(parser.load('[0:80.05]Invalid Timetamp'), false, "Invalid Timestamp" );
	assert.strictEqual(parser.load('[0:60]Invalid Timetamp'), false, "Invalid Timestamp" );
	assert.strictEqual(parser.load('[0:60.03]Invalid Timetamp'), false, "Invalid Timestamp" );
	assert.strictEqual(parser.load('[foo:bar]'), false, "Invalid ID Tag" );
	assert.strictEqual(parser.load(abnormal), true, 'LRC loaded via load()');
	assert.deepEqual(parser.getLyrics(), [{timestamp:190,text:'Normal'}], "Abnormal data filtered." );
	assert.deepEqual(parser.getIDTags(), {artist:'Artist',title:'Title'}, "Abnormal data filtered.");
});
QUnit.test("Select Lyric", function(assert) {
	var lrc = new Lyrics(sample);
	assert.strictEqual(lrc.select(0), -1);
	assert.strictEqual(lrc.select(0.1), -1);
	assert.strictEqual(lrc.select(0.2), -1);
	assert.strictEqual(lrc.select(27.53), -1);
	assert.strictEqual(lrc.getLyric(lrc.select(27.53)), undefined);
	assert.strictEqual(lrc.select(27.54), 0);
	assert.deepEqual(lrc.getLyric(lrc.select(27.54)), {timestamp:27.54,text:'Ah! ほのかな予感から始まり'});
	assert.strictEqual(lrc.select('27.55'), 0);
	assert.deepEqual(lrc.getLyric(lrc.select('27.55')), {timestamp:27.54,text:'Ah! ほのかな予感から始まり'});
	assert.strictEqual(lrc.select(33), 1);
	assert.deepEqual(lrc.getLyric(lrc.select(33)), {timestamp:32.97,text:'Ah! 希望が星空駈けて'});
	assert.strictEqual(lrc.select(166), 22);
	assert.deepEqual(lrc.getLyric(lrc.select(166)), {timestamp:165.37,text:'光を追いかけてきた僕たちだから'});
	assert.strictEqual(lrc.select(272), 37);
	assert.deepEqual(lrc.getLyric(lrc.select(272)), {timestamp:271.52,text:'Ah! ほのかな予感から始まり'});
	assert.strictEqual(lrc.select(278), 38);
	assert.deepEqual(lrc.getLyric(lrc.select(278)), {timestamp:277.41,text:'Ah! 光を追いかけてきたんだよ…'});
	assert.strictEqual(lrc.select(300), 39);
	assert.deepEqual(lrc.getLyric(lrc.select(300)), {timestamp:288.41,text:''});
	assert.strictEqual(lrc.select('s300al'), -1, 'Invalid Timestamp Test');
});
QUnit.test("ID Tag parsing", function(assert) {
	var lrc = new Lyrics(id_tags_only);
	assert.deepEqual(lrc.getIDTags(), {
		artist:'Lyrics artist',
		album:'Album where the song is from',
		title:'Lyrics (song) title',
		author:'Creator of the Songtext',
		length:'How long the song is',
		by:'Creator of the [LRC] file',
		offset:21,
		createdBy:'The player or editor that created the LRC file',
		createdByVersion:'v0.3.0',
	});
	assert.strictEqual(lrc.getLyrics(), undefined);
});
QUnit.test("Test Time Offset", function(assert) {
	var lrc = new Lyrics();
	lrc.load(test_time_offset_down);
	assert.deepEqual(lrc.getLyric(lrc.select(1)), {timestamp:0.05,text:'One'});
	assert.deepEqual(lrc.getIDTags(), {offset:-101});
	lrc.load(test_time_offset_up);
	assert.deepEqual(lrc.getLyric(lrc.select(1)), {timestamp:2,text:'Three'});
	assert.deepEqual(lrc.getIDTags(), {offset:1000});
});
