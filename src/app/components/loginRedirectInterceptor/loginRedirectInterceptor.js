(function(){
    'use strict';
    function loginRedirectInterceptor($injector, $q) {
        var loginRedirectInterceptor = {
            responseError: function(response) {
                var $state = $injector.get('$state');
                if (response.status === 401 || response.status === 403)
                {
                    //console.log("REDIRIGIR");
                    $state.go('home', {returnTo:$state.current.name, withParams:$state.params}, {custom:{'silent': true}});
                }
                return $q.reject(response);
            }
        };
        return loginRedirectInterceptor;
    }
    angular.module('hce.app').factory('loginRedirectInterceptor', ['$injector', '$q', loginRedirectInterceptor]);
    /*
      CAMBIAR ESTO
    */
    angular.module('hce.app').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('loginRedirectInterceptor');
    }]);
})();