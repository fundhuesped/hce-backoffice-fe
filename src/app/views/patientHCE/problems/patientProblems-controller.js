(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProblemsController', patientProblemsController);

	patientProblemsController.$inject = ['$state', 'HCService', 'PatientProblem', 'FamilyPatientProblem', 'toastr', 'moment', 'Problem', '$uibModal', 'SessionService'];

    function patientProblemsController ($state, HCService, PatientProblem, FamilyPatientProblem, toastr, moment, Problem, $uibModal, SessionService) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientProblem = {};
      vm.searchPatientProblems = searchPatientProblems;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.getProblems = getProblems;
      vm.radio = {};
      vm.openNewProblemModal = openNewProblemModal;
      vm.cancelNewPatientProblem = cancelNewPatientProblem;
      vm.showNewPatientProblem = false;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSaveNewProblem = canSaveNewProblem;
      vm.canEditProblem = canEditProblem;
      vm.hasPermissions = false;
      vm.isSearching = false;
      vm.isSearchingFamilyProblems = false;
      vm.deletePatientProblemChanges = deletePatientProblemChanges;
      vm.deleteFamilyPatientProblemChanges = deleteFamilyPatientProblemChanges;

      vm.translateRelationship = FamilyPatientProblem.translateRelationship;

      vm.openNewFamilyProblemModal = openNewFamilyProblemModal;
      vm.openEditFamilyProblemModal = openEditFamilyProblemModal;
      vm.familyPager = {
        currentPage : 1,
        pageSize : 5,
        totalItems : null,
        pageChanged : familyPagerChanged
      };

      vm.openEditProblemModal = openEditProblemModal;

      Object.defineProperty(
          vm,
          'newPatientProblem', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.newPatientProblem;
          },
          set: function (value) {
            if(!HCService.newPatientProblem){
              HCService.openNewPatientProblem();
            }
          }
      });

      Object.defineProperty(
          vm,
          'patientProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.patientProblems;
          }
      });

      Object.defineProperty(
          vm,
          'activeProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activeProblems;
          }
      });

      Object.defineProperty(
          vm,
          'closedProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.closedProblems;
          }
      });
      activate();

      vm.startDateCalendarPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.closeDateCalendarPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      function canSaveNewProblem() {
        if(!vm.hasPermissions) return false;

        if(vm.newPatientProblem && vm.newPatientProblem.startDate&&vm.newPatientProblem.state&&vm.newPatientProblem.state=='Active'&&vm.newPatientProblem.problem){
          return true;
        }
        if(vm.newPatientProblem && vm.newPatientProblem.startDate&&vm.newPatientProblem.closeDate&&vm.newPatientProblem.state&&vm.newPatientProblem.state=='Closed'&&vm.newPatientProblem.problem){
            return true;
        }

        return false;
      }

      function closeEvolution() {
        HCService.closeEvolution().then(function() {
          toastr.success('Visita cerrada con exito');
        }, showError);
      }

      function deletePatientProblemChanges(patientProblem) {
        var tmpPatientProblem = new PatientProblem();
        tmpPatientProblem.id = patientProblem.id;
        tmpPatientProblem.$delete(function(){
          toastr.success('Problema eliminado con exito');
          searchPatientProblems();
        }, showError);
      }

      function deleteFamilyPatientProblemChanges(familyPatientProblem) {
        var tmpFamilyProblem = new FamilyPatientProblem();
        tmpFamilyProblem.id = familyPatientProblem.id;
        tmpFamilyProblem.$delete(function(){
          toastr.success('Antecedente familiar eliminado con exito');
          searchFamilyPatientProblems();
        }, showError);
      }

	    function activate(){
        Problem.getActiveList(function(problems){
          vm.problems = problems;
        }, displayComunicationError);
        searchFamilyPatientProblems();
        searchPatientProblems();
        if(vm.newPatientProblem){
          vm.showNewPatientProblem = true;
        }

        SessionService.checkPermission('hc_hce.add_patientproblem')
          .then( function(hasPerm){
              vm.hasPermissions = hasPerm;
          }, function(error){
              vm.hasPermissions = false;
              console.error("=== Error al verificar permisos en controlador ===");
              console.error(error);
              console.trace();
          });
	    }

      function pageChanged() {
        searchPatientProblems();
      }

      function familyPagerChanged() {
        searchFamilyPatientProblems();
      }

      function searchFamilyPatientProblems() {
        var filters = {};
        filters.page = vm.familyPager.currentPage;
        filters.page_size = vm.familyPager.pageSize;
        filters.pacienteId = HCService.currentPacienteId;
        vm.isSearchingFamilyProblems = true;

        FamilyPatientProblem.getPaginatedForPaciente(filters,function (paginatedResult) {
          vm.isSearchingFamilyProblems = false;
          vm.familyProblems = paginatedResult.results;
          if(vm.familyPager.currentPage===1){
            vm.familyPager.totalItems = paginatedResult.count;
          }
        },function (err) {
          vm.isSearchingFamilyProblems = false;
           displayComunicationError()
        });
      }
      function searchPatientProblems() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.isSearching = true;

        HCService.getPatientProblems(vm.filters).$promise.then(function (paginatedResult) {
          vm.isSearching = false;

          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
            vm.isSearching = false;
            displayComunicationError()
        });
      }

      function openEditProblemModal(selectedProblem) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/problems/patientProblem.html',
          size: 'md',
          controller: 'PatientProblemController',
          controllerAs: 'PatientProblemController',
          resolve: {
            patientProblem: function () {
              return selectedProblem;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientProblems();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });

      }

      function openNewProblemModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/problems/newPatientProblem.html',
          size: 'md',
          controller: 'NewPatientProblemController',
          controllerAs: 'NewPatientProblemController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='created'){
            searchPatientProblems();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });

      }


      function openNewFamilyProblemModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/problems/newFamilyProblem.html',
          size: 'md',
          controller: 'NewFamilyProblemController',
          controllerAs: 'NewFamilyProblemController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='familyProblemCreated'){
            activate();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

      function openEditFamilyProblemModal(selectedFamilyProblem) {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/problems/editFamilyProblem.html',
          size: 'md',
          controller: 'EditFamilyProblemController',
          controllerAs: 'EditFamilyProblemController',
          resolve: {
            familyProblem: function () {
              return selectedFamilyProblem;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='familyProblemEdited' || resolution =='markedError'){
            activate();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }


      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getProblems($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Problem.getFullActiveList(filters, function(problems){
          vm.problems = problems;
        }, displayComunicationError).$promise;

      }

      function openNewPatientProblem() {
          HCService.openNewPatientProblem();
      }

      function cancelNewPatientProblem() {
        vm.showNewPatientProblem = false;
        HCService.clearNewPatientProblem();
      }

      function canEditProblem(problem) {
        if(!vm.hasPermissions || (problem.state == PatientProblem.stateChoices.STATE_ERROR)){
          return false;
        }
        return true;
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
})();