// create a baitlist to check our page content against
const list = [

];


function aContainsB(a, b) {
    return a.indexOf(b) >= 0;
}
function runClock(e) {
	alert("clicked!!")
}
// function to compare string to our baitlist.
function isClickbait( string ) {
	// is the string short than 20 or longer than 100 characters? Probably not a title.
	
	if ( aContainsB(string, 'minutes') ) {
		// console.log(string)
		var regexp = /[0-9]{1,3}\s*(Seconds|Minutes|Hours|Sec|Min|Hrs|S|M|H)(\.|\,|\s*)/gi
		var myStr = string.match(regexp)
		
		// console.log('logging my string:',myStr)



		return myStr;
	}
	return false
	// return false
	// it is? let's compare it to our baitlist
	// return list.some( function ( clickbait, i ) {
	// 	// if it matches, log the offending string to the console and return it to our strike function
	// 	if ( clickbait.test( string ) ) {

	// 		console.log( i, string );
	// 		return true;

	// 	}

	// } );

}

// found some clickbait? Let's strike it through
	function strikeIfClickbait( element ) {
		if ( element.hasChildNodes() ) {
			// console.log('a single element', element)
			// console.log('theElement children:',element.childNodes)
			var myStr = isClickbait( element.textContent.trim() )
			if ( myStr ) {
				var oldStr = element.textContent.trim()
				console.log('hit counted')
				// console.log('replacing the elements', oldStr, myStr)
				element.innerHTML = oldStr.replace(myStr, '<span id="timer-1" style="color: lime; font-weight: bold; cursor: pointer; z-index: 999;">$&</span>')
			}
		}
	}


function strikeClickbaitLinks( element ) {

	const elements = element.getElementsByTagName( 'li' );
	[ ...elements ].forEach( strikeIfClickbait );

}

function initObserver() {

	const observer = new MutationObserver( function ( mutations ) {

		mutations.forEach( function ( mutation ) {

			mutation.addedNodes.forEach( function ( node ) {

				if ( node.nodeType === Node.ELEMENT_NODE ) strikeClickbaitLinks( node );

			} );

		} );

	} );

	observer.observe( document.body, { childList: true, subtree: true } );

}


function startListening() {
	console.log('sup event listeners?')
	document.querySelector('[id^="timer-"]').addEventListener('click', runClock)
}


strikeClickbaitLinks( document.body );


// invoke the initObserver function to start the checking process
initObserver();

// document.addEventListener('DOMContentLoaded', function () {
// 	console.log('Listening for events')
//   // document.querySelector('button').addEventListener('click', clickHandler);

// });


window.addEventListener("load", function(event) {
	startListening()
    console.log("All resources finished loading!");
  });