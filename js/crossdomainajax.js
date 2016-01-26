/* 
 * Melissa Khuat
 * Computer Science & Engineering
 * University of Washington, 2017
 * Slack Coding Exercise: Website Analyzer
 * 
 * High-level overview: This jQuery module uses the Yahoo Query Language (YQL) Platform to allow 
 *						GET requests across domains. 
 *						Enables the analyzing web app to fetch HTML source from a page.
 *
 *
 * Attribution: James Padolsey (https://github.com/padolsey-archive/jquery.fn/)
 *
 */ 

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'SELECT * FROM html WHERE url="{URL}" AND xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Change options so that JSONP-x request is made to YQL
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // complete == success (JSONP request)
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    if (_success) { // Empty callback
                        _success.call(this, {
                            responseText: (data.results[0] || '').replace('', '')
                        }, 'success');
                    }                    
                };
            })(o.success);
            
        }
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);