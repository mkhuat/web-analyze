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

	/* Sets up the event handlers on the page */
	window.onload = function() {
		var queryButton = document.getElementById("query");
		queryButton.onclick = getWebContent;		
	};
	
	/* Fetches and displays analysis and source code */
	function getWebContent() {
		var url = document.getElementById("url").value;
		var errMsg = document.getElementById("error");
		var analysisArea = document.getElementById("analysis");
	
		/* Check for empty url strings. No need for alert message. */
		if (url.trim() == "") {			
			return;
		}
	
		/* 
		 * The Ajax request requires "http://" to prefix the website name.
		 * Example: request for "slack.com" must be prefixed with "http://" 
		 */
		if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0) {
			var prefix = "http://"
			url = prefix.concat(url);
		}
			
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'xml',
			success: function(data) {
  				var source = data.responseText;
				if (source.trim() == "") {
					alert("Results unavailable for this URL. Please enter a valid address.");
					return;
				}
				displayResultSections();
				displaySourceCode(source);
				
				/* Simple filter for HTML tags. Ideal: XML parsing. */
				var arr = source.match(/(<([a-z1-6-]*))/gi);			
				var dict = createCountDict(arr);
				displayTagCount(dict);	
			}
		});		
		
	}
	
	/* Displays the result headers and sections for Analysis and Source */
	function displayResultSections() {
		var headers = document.getElementsByClassName("page-scroll");
		for (var i = 0; i < headers.length; i++) {
			headers[i].style.display = "";
		}
		var results = document.getElementById("resultsArea");
		results.style.display = "";
	}
	
	/* 
	 * Constructs a dictionary with each unique element in the 
	 * given array and its corresponding count. 
	 *    Form: [{key: string, value: int}...]
	 */
	function createCountDict(arr) {
		var dict = [];				
		for (var i = 0; i < arr.length; i++) {
			var keyIndex = indexOfKey(dict, arr[i]);
			var el = "" + arr[i];
			if (keyIndex == -1) {
				/* Add new entry to dict if one does not exist */
				dict.push({key:el, 
						   value:1});					
			} else {
				/* Update entry */
				var count = dict[keyIndex].value + 1;
				dict.splice(keyIndex, 1);
				dict.push({key:el, 
						   value:count});
			}
		}
		return dict;
	}
	
	 
	/* Displays the source code of the queried webpage. */ 
	function displaySourceCode(source) {
		var sourceCodeArea = document.getElementById("source");
		var res = document.createElement('xmp');
		res.innerHTML = source;
		res.classList.add("wrap-text");
		document.getElementById("source").innerHTML = ""; /* Reset section */
		sourceCodeArea.appendChild(res);	
	}
	
	/* Displays a table of tags and their corresponding counts. */ 
	function displayTagCount(dict) {
		refreshTable();
		var table = document.getElementById("flatTable");
		for (var i = 0; i < dict.length - 1; i++) {
			var row = document.createElement('tr');
			var tag = document.createElement('td');
			var ct = document.createElement('td');
			tag.innerHTML = (dict[i].key).substring(1);
			ct.innerHTML = dict[i].value;
			row.appendChild(tag);
			row.appendChild(ct);
			row.classList.add("entry");
			table.appendChild(row);
		}
		
		/* jQuery event listeners for entries in the analysis table */
		$("#flatTable").on("mouseenter", ".entry", function() {
			$(this).css('background-color', '#ffd9b3');
		}).on("mouseleave", ".entry", function() {
			$(this).css('background-color', '#edeced');
		}).on("click", ".entry", function() {
			refreshSelection();   /* orange oompaloompa class removed */
			$(this).addClass('oompaloompa'); 
			$("#source").unhighlight();
			highlightMatches(this.childNodes[0].textContent);
		});
		
	}
	
	/* 
	 * Returns the index of the given key in the dictionary,
	 * or -1 if it does not exist.
	 */
	function indexOfKey(dict, key) {
		for (var i = 0; i < dict.length; i++) {
			if (dict[i].key == key) return i;			
		}
		return -1;
	}
	
	/* Removes previouly selected/highlighted entries in Analysis table */
	function refreshSelection() {
		var entries = document.getElementsByClassName("entry");
		for (var i = 0; i < entries.length; i++) {
			entries[i].classList.remove('oompaloompa');
		}
	}
	
	/* Removes entries in Analysis table from previous URL search */
	function refreshTable() {
		$("#flatTable").children().slice(1).remove();
	}
	
	/* Highlights opening and closing tags that match the given target */
	function highlightMatches(target) {
		$("#source").highlight("<" + target + " ", { caseSensitive: true });
		$("#source").highlight("</" + target + ">", { caseSensitive: true });
		$("#source").highlight("<" + target + ">", { caseSensitive: true });				
	}
	
})();


