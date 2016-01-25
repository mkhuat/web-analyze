/* 
 * Melissa Khuat
 * Computer Science & Engineering
 * University of Washington, 2017
 * Slack Coding Exercise: Website Analyzer
 * 
 * High-level overview: Allows dynamic fetching of HTML source from a given URL.
 *						
 * 
 */ 

"use strict";

(function() {

	// Sets up the event handlers on the page
	window.onload = function() {
		var queryButton = document.getElementById("query");
		queryButton.onclick = getWebContent;
		
	};

	// 
	function getWebContent() {
		var url = document.getElementById("url").value;
		var sourceCodeArea = document.getElementById("mySource");
	
		// Check for empty url strings
		if (url.trim() == "") {
			// make a div saying "Please enter a valid website address"
			return;
		}
	
		// The Ajax requests require "http://" to prefix the website name
		// Example: request for "slack.com" must be prefixed with "http://"
		if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
			var prefix = "http://"
			url = prefix.concat(url);
		}
			
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'xml',
			success: function(data) {
				// Display tag statistics
				
				var xmlDoc = data.responseXML;
				var res = document.createElement('p');
				res.innerHTML = xmlDoc.length;
				sourceCodeArea.appendChild(res);
 				
				// Display source code
/* 				var source = data.responseText;
				var res = document.createElement('xmp');
				res.innerHTML = source;
				res.classList.add("wrap-text");
				sourceCodeArea.appendChild(res);
 */			}
		});
	}
	
	// Sets display of element with given id (show or hide)
	function toggleLoad() {
		display = "";
		var load = document.getElementById("loading");
		if (load.style.display == "") display = "none";
		load.style.display = display;
	}
	
})();


