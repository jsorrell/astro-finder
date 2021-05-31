let raTime = null;
let raChange = null;
let timer = null;

function getRADeg(raStr) {
	const raRegexp = /([\d.]+)h ?([\d.]+)m ?(?:([\d.]+)s)?/;

	let raMatches = raRegexp.exec(raStr);
	if (raMatches == null) {
		return null;
	}

	let deg = parseFloat(raMatches[1]) + parseFloat(raMatches[2])/60;
	if (typeof(raMatches[3]) !== 'undefined') {
		deg += parseFloat(raMatches[3])/3600;
	}

	return 15 * deg;
}

function getDecDeg(decStr) {
	const decRegexp = /([+-])([\d.]+)[°] ?([\d.]{1,2})['’′] ?(?:([\d.]+)[\"”″])?/;

	let decMatches = decRegexp.exec(decStr);
	if (decMatches == null) {
		return null;
	}

	let deg = parseFloat(decMatches[2]) + parseFloat(decMatches[3])/60 + parseFloat(decMatches[4])/3600;
	if (decMatches[1] === "-") {
		deg = -deg;
	}

	return deg;
}

function getRAChange(raStart, raEnd) {
	if (raStart == null || raEnd == null) {
		return null;
	}

	return raStart - raEnd;
}

function getDecChange(decStart, decEnd) {
	if (decStart == null || decEnd == null) {
		return null;
	}

	return decEnd - decStart;
}

function setRAChangeLabel(raChange) {
	let val = "ERROR";
	if (raChange != null) {
		let deg = Math.trunc(raChange);
		let mins = Math.floor((raChange-deg)*60);

		let sign = raChange < 0 ? '-' : '+';
		val = `${sign} ${Math.abs(deg)}° ${Math.abs(mins)}"`
	}

	$("input[name='output-ra']").val(val);
}

function setDecChangeLabel(decChange) {
	let val = "ERROR";
	if (decChange != null) {
		let direction = decChange > 0 ? "towards" : "away from";
		let deg = Math.abs(decChange/(360/121.75)).toFixed(2);
		val = `${deg} turns ${direction} North`;
	}

	$("input[name='output-dec']").val(val);
}

function update() {
	clearTimeout(timer);

	var refRA = $("input[name='ref-ra']").val();
	var refDec = $("input[name='ref-dec']").val();
	var targetRA = $("input[name='target-ra']").val();
	var targetDec = $("input[name='target-dec']").val();

	raChange = getRAChange(getRADeg(refRA), getRADeg(targetRA));
	setRAChangeLabel(raChange);

	let decChange = getDecChange(getDecDeg(refDec), getDecDeg(targetDec));
	setDecChangeLabel(decChange);
}

function zero() {
	raTime = new Date();
	function tick() {
		let now = new Date();
		setRAChangeLabel(raChange + (now.getTime() - raTime.getTime()) / 1000 / 240);
		timer = setTimeout(tick, 1000);
	};
	tick();
}
