function displayDateGraduation(dateGraduation) {
	let months = Math.trunc(dateGraduation);
	let remainder = dateGraduation - months;
	let dateGraduationTicks = remainder * 15;
	$("input[name='date-grad']").val(`${getMonthName(months)} ${dateGraduationTicks.toFixed(2)} Ticks`);
}

function update() {
	const zero = 5.72;

	ra = getRADeg($("input[name='ra']").val());
	longitude = +($("input[name='longitude']").val());

	setCookie("longitude", "" + longitude);

	function tick() {
		let siderealTime = calculateLocalSiderealTime(longitude)/15;
		let dateGraduation = (zero + (ra + siderealTime)/2) % 12;
		// Ensure we choose the top option so the camera is not upside down
		dateGraduation = zero <= dateGraduation && dateGraduation <= zero + 6 ? dateGraduation : (dateGraduation + 6) % 12
		displayDateGraduation(dateGraduation);

		timer = setTimeout(tick, 1000);
	}
	tick();
}

$(document).ready(function() {
	let longCookie = getCookie("longitude");
	if (longCookie !== null) {
		$("input[name='longitude']").val(longCookie);
	}
});
