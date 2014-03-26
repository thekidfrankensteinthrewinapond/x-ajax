(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.XAjaxElement = factory();
  }
}(this, function(){  

  var converters = {
    'json': function(data) {
      return JSON.parse(data);
    }
  };
  
  xtag.register('x-ajax', {
    lifecycle: {
      created: function() {},
      inserted: function() {
        this.send();
      },
      removed: function() {},
      attributeChanged: function() {
        this.send();
      }
    }, 
    events: { 
    
    },
    accessors: {
      url: { attribute: true },
      method: { attribute: true },
      type: { attribute: true },
      response: {
        get: function(){
          return this._response;
        },
        set: function(value){
          this._response = value;
        }
      }
    }, 
    methods: {
      send: function(){
        var req = new XMLHttpRequest();
        var url = this.url;
        var method = this.method || 'GET';

        req.open(method, url, true);

        // TODO allow headers

        req.onload = function(){
          var response = req.response;
          var coerce = converters[this.type];
          this.response = coerce ? coerce(response) : response;

          xtag.fireEvent(this, 'load', {
            bubbles: false,
            response: this.response
          });
        }.bind(this);

        req.send();
      }
    }
  });

}));
