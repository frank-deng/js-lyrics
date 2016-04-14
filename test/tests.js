var parse_simple = Lyrics.parse(document.getElementById('sample').innerHTML);
var parse_complex = Lyrics.parse(document.getElementById('sample_complex').innerHTML);
function compare_lyrics(lrc0, lrc1){
	if (lrc0.length != lrc1.length) {
		return false;
	}
	for (i = 0; i < lrc0.length; i++) {
		if (lrc0.timestamp !== lrc1.timestamp || lrc0.text !== lrc1.text) {
			return false;
		}
	}
	return true;
}

QUnit.test("LRC Test", function(assert) {
	assert.equal(parse_simple.length, 40, "Simple LRC: Number of Lines OK." );
	assert.equal(parse_complex.length, 40, "Complex LRC: Number of Lines OK." );
	assert.ok(compare_lyrics(parse_simple, parse_complex), 'Timestamp Value and Lyric Text Matches between simple LRC and complex LRC.');
});
