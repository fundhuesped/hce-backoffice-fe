(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function loginCtrl ($state, SessionService, $loading, toastr) {
        var vm = this;
        vm.errorMessage = null;
        vm.login = login;
        vm.rememberMe = true;
        vm.hideErrorMessage = hideErrorMessage;

        function login(){
            $loading.start('app');
            hideErrorMessage();

            if(vm.LoginForm.$valid){
                SessionService.login(vm.username, vm.password, vm.rememberMe, function(){
                    $loading.finish('app');
                    $state.transitionTo('home');
                }, function(errorResponse){
                    $loading.finish('app');
                    if(errorResponse.status === 401){
                        vm.errorMessage = 'Usuario o password incorrecto';
                    }else{
                        displayComunicationError('app');
                    }
                });
            }
    	}

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function displayComunicationError(loading){
          if(!toastr.active()){
            toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
          }
          if(loading){
            $loading.finish(loading);
          }
        }
    }
    angular.module('hce.login').controller('LoginController',['$state', 'SessionService', '$loading', 'toastr', loginCtrl]);
})();