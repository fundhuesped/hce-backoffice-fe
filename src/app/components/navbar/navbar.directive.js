(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceNavbar', hceNavbar);

  /** @ngInject */
  function hceNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'NavbarController',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($state, moment, SessionService, HCService, toastr, $uibModal) {
      var vm = this;
      vm.currentUser = SessionService.currentUser;
      vm.logout = SessionService.logout;
      vm.currentUserCan = SessionService.currentUserCan;
      vm.closeEvolution = closeEvolution;
      vm.currentPaciente = {};
      vm.years = null;
      vm.formatedBirthDate = formatedBirthDate;
      vm.openPacientePersonalInfoModal = openPacientePersonalInfoModal;
      vm.isDirty = HCService.isDirty();

      Object.defineProperty(
          vm,
          'currentPaciente', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentPaciente;
          }
      });

      Object.defineProperty(
          vm,
          'currentEvolution', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentEvolution;
          }
      });

      Object.defineProperty(
          vm,
          'years', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentPaciente?moment().diff(HCService.currentPaciente.birthDate, 'years'):null;
          }
      });

      activate();

      function activate() {
      }

      function openPacientePersonalInfoModal() {
        var modalInstance = $uibModal.open({
            backdrop: 'static',
          templateUrl: 'app/views/patient/patientPersonalInfo.html',
          size: 'lg',
          controller: 'PatientPersonalInfoCtrl',
          controllerAs: 'PacienteCtrl',
          resolve: {
            paciente: function () {
              return vm.currentPaciente;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='modified' || resolution==='deleted' || resolution==='reactivated'){
            toastr.success('Paciente modificado con éxito');
            HCService.refreshPacienteInformation();
          }
        });

      }

      function openLeaveHCEModal() {
        return $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/components/navbar/closeEvolution-modal.html',
          size: 'md',
          controller: 'CloseEvolutionController',
          controllerAs: 'CloseEvolutionController',
          resolve: {
            canDiscardChanges: function () {
              return HCService.isDirty();
            }
          }
        });
      }

      function formatedBirthDate() {
        return (vm.currentPaciente?moment(vm.currentPaciente.birthDate, "YYYY-MM-DD").format('DDMMYYYY'):"");
      }
      function closeEvolution() {
        HCService.closeEvolution().then(function() {
          toastr.success('Visita cerrada con exito');
          HCService.unmarkAsDirty();
          HCService.cleanHistoryStack();
          $state.go('app.patientSearch');
        }, function (error) {
          if(error=='ISDIRTY'){
            openLeaveHCEModal().result
            .then(function (resolution) {
              if(resolution==='save'){
                HCService.saveNewEvolution(function () {
                  HCService.unmarkAsDirty();
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
                HCService.discardChanges(function () {
                  HCService.finishDiscardChanges();
                  $state.go('app.patientSearch');
                }, showError);
              }
            }, function () {
              console.error("No se pudo abrir el modal")
            })
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


    }
  }

})();
