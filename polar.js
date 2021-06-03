let timer = null;

function calculatePolarAlignmentTime(longitude, dateGraduation) {
	let verticleReticleTime = (18 - calculatePolarTime(longitude)/2) % 12;
	return (verticleReticleTime + dateGraduation + 1) % 12;
}

function displayPolarTime(polarTime) {
	let hours = Math.floor(polarTime);
	// let minutes = Math.floor((polarTime - hours) * 60);
	// let seconds = Math.floor((polarTime - hours - minutes / 60) * 3600);
	let reticleTicks = (polarTime - hours) * 6;
	$("input[name='rot-time']").val(`${hours} Hours ${reticleTicks.toFixed(2)} Ticks`);
}

function update() {
	clearTimeout(timer);

	dateGrad = +($("input[name='date-grad']").val()) + $("input[name='date-grad-parts']").val()/15;
	longitude = +($("input[name='longitude']").val());

	function tick() {
		let polarTime = calculatePolarAlignmentTime(+(longitude), dateGrad);
		displayPolarTime(polarTime);
		timer = setTimeout(tick, 1000);
	}
	tick();
}
