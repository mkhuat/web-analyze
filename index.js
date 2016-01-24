// Melissa Khuat, CSE 154 AC, Homework 7: ASCIImation
// Creates and animates ASCII art with user's chosen animation, size, and speed.

"use strict";

(function() {
	// var timer = null; // stores ID of interval timer ////////////////////////////// A BUNCH OF CONSTANT VARIABLES!!!
	// var currentFrame = 0; // index of the frame the animation is on

	// Sets up the event handlers on the page
	window.onload = function() {
		var queryButton = document.getElementById("query");
		queryButton.onclick = start;
		
	};

	function start() {
		var name = document.getElementById("urlhi").value;
		
		var analysisArea = document.getElementById("myAnalysis");
		var sourceCodeArea = document.getElementById("mySource");
		
		analysisArea.innerHTML = name;
		
			
		// var stuff = document.createElement("p");
		// stuff.innerHTML = name;
		// analysisArea.appendChild(stuff);
	}
	
})();