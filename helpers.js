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

function calculatePolarisRA() {
	// Estimation by linearly interpolating between fixed points
	const RAs = {
		20: 176.73,
		21: 177.96,
		22: 179.26,
		23: 180.66,
		24: 182.17,
		25: 183.82,
		26: 185.53,
		27: 187.30,
		28: 189.15,
		29: 191.02,
		30: 192.83
	};

	let now = new Date();

	let raJan1 = RAs[now.getFullYear()-2000];
	let raDec31 = RAs[now.getFullYear()-1999];

	const secondsInYear = 1000 * 60 * 60 * 24 * 365.2422;
	let percentComplete = (now - new Date(now.getFullYear(), 0, 0)) / secondsInYear;

	return (raJan1 * (1-percentComplete) + raDec31 * percentComplete)/60;
}

function calculateGreenwichSiderealTime() {
	// https://thecynster.home.blog/2019/11/04/calculating-sidereal-time/
	let now = new Date();
	let julianDateUTC = (now / 86400000) + 2440587.5;
	let julianDateTT = julianDateUTC + (37 /* Leap Seconds to date */ + 32.184)/86400;

	let du = julianDateUTC - 2451545;
	let t = (julianDateTT - 2451545)/36525;

	let th = 360 * (0.7790572732640 + 1.00273781191135448 * du); // Degrees
	let gmst = 0.014506 + 4612.156534*t +  1.3915817*Math.pow(t, 2) - 0.00000044*Math.pow(t, 3) - 0.000029956*Math.pow(t, 4) - 0.0000000368*Math.pow(t, 5); // Arcsec

	let angle = (th + (gmst / 3600)) % 360;

	return angle;
}

function calculateLocalSiderealTime(longitude) {
	return (calculateGreenwichSiderealTime() + longitude) % 360;
}

function calculatePolarTime(longitude) {
	siderealTime = calculateLocalSiderealTime(longitude)/15;
	polarisRA = calculatePolarisRA();
	polarisTime = siderealTime - polarisRA;

	return polarisTime;
}

function getMonthName(month) {
	return [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"September",
		"October",
		"November",
		"December"
	][month];
}
