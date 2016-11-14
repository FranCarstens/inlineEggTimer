function fetchDuration( string ) {
	var timeUnit = /[0-9]{1,3}\s*(Seconds|Minutes|Hours|Sec|Min|Hrs)/gi
	// var timeUnit = /[0-9]{1,3}\s*(Seconds|Minutes|Hours|Sec|Min|Hrs|S|M|H)(\.|\,|\s*)/gi REMOVED TO AVOID COMPLEXITY
	if ( string.match(timeUnit) ) {	
		var durationArr = string.match(timeUnit)
		return durationArr[0]
	}
	return false
}

function toSeconds( durationStr ) {
	var sec = /[0-9]{1,3}\s*(Seconds|Sec)/gi,
		min = /[0-9]{1,3}\s*(Minutes|Min)/gi,
		hrs = /[0-9]{1,3}\s*(Hours|Hrs)/gi,
		num = /[0-9]{1,3}/
	if ( sec.test(durationStr) ) {
		counterDuration = (durationStr.match(num))[0]
	}
	else if ( min.test(durationStr) ) {
		counterDuration = (durationStr.match(num))[0] * 60
	}
	else if ( hrs.test(durationStr) ) {
		counterDuration = (durationStr.match(num))[0] * 3600
	}
	return counterDuration

}

function formatTimer(timeTotal) {

	var hrs = parseInt(timeTotal/3600),
		min = parseInt((timeTotal%3600)/60),
		sec = parseInt((timeTotal%3600)%60)

		hrs = hrs < 10 ? `0${hrs}` : hrs,
		min = min < 10 ? `0${min}` : min,
		sec = sec < 10 ? `0${sec}` : sec

	return `${hrs}:${min}:${sec}`

}

function soundAlarm(et) {

	var i = 0
	document.addEventListener(et, function() {i = 25})
	setInterval(function() {
		if (i < 30) {
			var file = chrome.extension.getURL('loud.mp3');		
			var audio = new Audio(file)
			console.log(audio)
			audio.play()
			i ++
		}
	}, 1000)

}

function runTimer(e) {
	console.log('Timer Active')
	duration = e.target.attributes.name.value
	console.log(duration)
	setInterval(function() {

		if (duration >= 0) {
			e.target.innerHTML = formatTimer(duration)
			duration --

			if (duration < 1) { 
				soundAlarm(e.target)
				return
			}
			console.log(duration)
		}
		else return

	}, 1000);

}

function inlineTimer(durationStr, tid) {
	
	var duration = toSeconds(durationStr)
	return `${durationStr}<div class="timer" id="timer_${tid}" style="display:none;" name="${duration}">${formatTimer(duration)}</div>`

}

function addTimerIfCookTime( element, index ) {
	var fullString = element.textContent.trim()
	var durationStr = fetchDuration( fullString )
	var tid = index
	if ( durationStr ) {
		element.innerHTML = fullString.replace(durationStr, inlineTimer(durationStr, tid))
	}
}


function initiateRecipeTimers( element ) {

	const elements = element.getElementsByTagName( 'li' );
	[ ...elements ].forEach( addTimerIfCookTime );

}

function initObserver() { // from https://github.com/mrdoob/clickbait-stopper
	const observer = new MutationObserver( function ( mutations ) {
		mutations.forEach( function ( mutation ) {
			mutation.addedNodes.forEach( function ( node ) {
				if ( node.nodeType === Node.ELEMENT_NODE ) initiateRecipeTimers( node );
			} );
		} );
	} );
	observer.observe( document.body, { childList: true, subtree: true } );
}


/// LISTENERS AND RUNTIME EVENTS

function startListening() {
	console.log('sup event listeners?')
	document.querySelector('[id^="timer_"]').addEventListener('click', runTimer)
}
function showTimers() {
	document.querySelector('[id^="timer_"]').style = 'display:inline-block; background-color: black; padding: 0 5px; margin:0 5px; color: white; cursor: pointer;'
}

initiateRecipeTimers( document.body );

initObserver();

window.addEventListener("load", function(event) {
	startListening()
	showTimers()
    console.log("All resources finished loading!");
});