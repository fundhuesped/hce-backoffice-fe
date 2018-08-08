(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function changePasswordCtrl ($state, SessionService, $loading, toastr) {
        var vm = this;
        vm.errorMessage = null;
        vm.changePassword = changePassword;
        vm.hideErrorMessage = hideErrorMessage;
        vm.cancel = cancel;
        vm.changePasswordForm;


        vm.modal = {
            style: {},
            isVisible: false,
            show :  function showModal(){
                        this.style = {display:'block'};
                        this.isVisible = true;
                    },
            confirm:    function confirmModal(){
                            $state.go('home');
                        },
        };


        function changePassword(){
            
            $loading.start('app');
            hideErrorMessage();

            if(vm.changePasswordForm.$valid && !vm.modal.isVisible){
                SessionService.changePassword(vm.oldPassword, vm.newPassword, vm.repeatNewPassword, function(){
                    $loading.finish('app');
                    vm.modal.show();
                }, function(errorResponse){
                    $loading.finish('app');
                    if(errorResponse.status === 400){
                        vm.errorMessage = 'Revise los datos ingresados';
                    }else{
                        displayComunicationError('app');
                    }
                });
            }
    	}

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function cancel(){
            window.history.back();
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
    angular.module('hce.profile').controller('ChangePasswordCtrl',['$state', 'SessionService', '$loading', 'toastr', changePasswordCtrl]);
})();