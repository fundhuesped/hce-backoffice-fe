(function() {
  'use strict';

  angular
    .module('hce.app')
    .run(['$rootScope', '$location', '$cookieStore', '$http', '$state', 'lodash', 'HCService', '$uibModal', 'toastr', 'localStorageService', runBlock]);

  /** @ngInject */
  function runBlock($rootScope, $location, $cookieStore, $http, $state, lodash, HCService, $uibModal, toastr) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){ 
      if(!lodash.startsWith(toState.name, 'app.patientHCE') && !(toState.name=='home' && options.custom.loggedOut) && ((HCService.currentEvolution && HCService.currentEvolution.id) || HCService.isDirty())){
        event.preventDefault(); 

        openLeaveHCEModal().result.then(function (resolution) {
          if(resolution==='leave'){
            if(HCService.currentEvolution.id){
              HCService.cleanAll().then(function () {
                $state.go(toState);
              }, function (error) {
                toastr.error(error)
              }); 
            }else{
              HCService.cleanEvolution();
              $state.go(toState);
            }
          }
        }, function () {
          event.preventDefault(); 
        });
      }
    })




    function openLeaveHCEModal() {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'app/views/patientHCE/leaveHCEModal.html',
        size: 'md',
        controller: 'LeaveHCEController',
        controllerAs: 'Ctrl',
      });
    }

    function openAlreadyOpenModal() {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'app/views/alreadyOpen-modal.html',
        controller: 'AlreadyOpenController',
        controllerAs: 'Ctrl',        
        size: 'md',
      });
    }

    localStorage.setItem('isActive', Date.now());

    window.addEventListener('storage', function(event) {
      if (event.key == 'isActive') {
        localStorage.setItem('tabActive', Date.now());
        localStorage.removeItem('tabActive');
      } else if (event.key == 'tabActive' && !sessionStorage.getItem('activeTab')) {
        if(window.location.href.indexOf("Prescription")<0){
          openAlreadyOpenModal();
        }
      }
    });
  }
})();