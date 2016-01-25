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

	
	function getWebContent() {
		var url = document.getElementById("url").value;
		var sourceCodeArea = document.getElementById("source");
		var errMsg = document.getElementById("error");
		var analysisArea = document.getElementById("analysis");
	
		// Check for empty url strings
		if (url.trim() == "") {
			// make a div saying "Please enter a valid website address"
			var msg = document.createElement("p");
			msg.innerHTML = "Please enter a valid website address";
			errMsg.appendChild(msg);
			errMsg.style.display = "";
			return;
		}
	
		// The Ajax request requires "http://" to prefix the website name.
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
				// Display source code
  				var source = data.responseText;
				var res = document.createElement('xmp');
				res.innerHTML = source;
				res.classList.add("wrap-text");
				resetSections();
				sourceCodeArea.appendChild(res);
			
			
				// Display stats
				var arr = source.match(/(<([a-z1-6]*))/gi);
			
				// Construct a dictionary of tags-->count
				var dict = [];				
  				for (var i = 0; i < arr.length; i++) {
					var keyIndex = indexOfKey(dict, arr[i]);
					var el = "" + arr[i];
					if (keyIndex == -1) {
						// Add new entry to dict if one does not exist
						dict.push({key:el, 
								   value:1});					
					} else {
						// Update entry
						var count = dict[keyIndex].value + 1;
						dict.splice(keyIndex, 1);
						dict.push({key:el, 
								   value:count});
					}
				}

				for (var i = 0; i < dict.length; i++) {
					var text = document.createElement('p');
					text.innerHTML = (dict[i].key).substring(1)  + " " + dict[i].value;
					analysisArea.appendChild(text);
				}
			
			
			}
		});		
		
	}
	
	function indexOfKey(dict, key) {
		for (var i = 0; i < dict.length; i++) {
			if (dict[i].key == key) return i;			
		}
		return -1;
	}
	
	function resetSections() {
		document.getElementById("source").innerHTML = "";
		document.getElementById("analysis").innerHTML = "";
	}
	
	// Sets display of element with given id (show or hide)
/* 	function toggleLoad() {
		display = "";
		var load = document.getElementById("loading");
		if (load.style.display == "") display = "none";
		load.style.display = display;
	}
 */	

})();


