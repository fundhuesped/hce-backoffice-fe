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
          if(resolution==='save'){
            HCService.saveNewEvolution(function () {
              closeEvolution(function () {
              },
              function (error) {
                showError(error);
              });
            }, function (error) {
              showError(error);
            });
          }
          if(resolution=='discard'){
            HCService.discardChanges();
              closeEvolution(function () {
                // body...
              },
              function (error) {
                showError(error);
              });
          }
        }, function () {
        });
      }
    })

    function openLeaveHCEModal() {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'app/components/navbar/closeEvolution-modal.html',
          size: 'md',
          controller: 'CloseEvolutionController',
          controllerAs: 'Ctrl',
          resolve: {
            canDiscardChanges: function() {
              return HCService.isDirty();
            }
          }
      });
    }

    function closeEvolution() {
      HCService.closeEvolution().then(function() {
        toastr.success('Visita cerrada con exito');
        $state.go('app.patientSearch');
      }, function (error) {
        
        if(error=='ISDIRTY'){
          openLeaveHCEModal().result.then(function (resolution) {
            if(resolution==='save'){
              HCService.saveNewEvolution(function () {
                closeEvolution(function () {
                },
                function (error) {
                  showError(error);
                });
              }, function (error) {
                showError(error);
              });
            }
            if(resolution=='discard'){
              HCService.discardChanges();
                closeEvolution(function () {
                  // body...
                },
                function (error) {
                  showError(error);
                });
            }
          }, function () {
          });
        }else{
          showError(error);
        }
      });
    }

    function showError(error) {
      if(error){
        if(error.data){
          if(error.data.detail){
            toastr.error(error.data.detail);
          }else{
            toastr.error(error.data);
          }
        }else{
          toastr.error(error);
        }
      }else{
        toastr.error('Ocurrio un error');
      }
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
        //TODO FIXME understand this condition and add an exception if the tab is summaryDetails
        if(window.location.href.indexOf("Prescription")<0 && window.location.href.indexOf("Información adicional del virus HIV")>0){
          openAlreadyOpenModal();
        }
      }
    });
  }
})();