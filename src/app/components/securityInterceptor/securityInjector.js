(function(){
    'use strict';
    function tokenInjector($injector) {  
        var tokenInjector = {
            request: function(config) {
                var SessionSrv = $injector.get('SessionService');
                if (SessionSrv.currentToken) {     
                    if(config.url.indexOf('login') > -1){
                        return config;
                    }    
                    config.headers['Authorization'] = SessionSrv.currentToken;
                }
                return config;
            }
        };
        return tokenInjector;
    }

    angular.module('hce.app').factory('tokenInjector', ['$injector', tokenInjector]);  

    angular.module('hce.app').config(['$httpProvider', function($httpProvider) {  
        $httpProvider.interceptors.push('tokenInjector');
    }]);

})();