(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientProblemsController', patientProblemsController);

	patientProblemsController.$inject = ['$state', 'HCService', 'PatientProblem', 'FamilyPatientProblem', 'toastr', 'moment', 'Problem', '$uibModal'];

    function patientProblemsController ($state, HCService, PatientProblem, FamilyPatientProblem, toastr, moment, Problem, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientProblem = {};
      vm.saveNewPatientProblem = saveNewPatientProblem;
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
      vm.openCloseProblemModal = openCloseProblemModal;
      vm.cancelNewPatientProblem = cancelNewPatientProblem;
      vm.showNewPatientProblem = false;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSaveNewProblem = canSaveNewProblem;
      vm.canEditProblem = canEditProblem;

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
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.closeDateCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      function saveNewPatientProblem() {

        // if(vm.newProblemDateOption == 'today'){
        //   vm.newPatientProblem.startDate = moment().format('YYYY-MM-DD');
        // }else{
        //   if(vm.newProblemDateOption == 'otherDate'){
        //     vm.newPatientProblem.startDate = moment(vm.newProblemDate).format('YYYY-MM-DD');
        //   }
        // }
        HCService.saveNewPatientProblem().then(function() {
          toastr.success('Problema guardado con exito');
          vm.showNewPatientProblem = false;
          searchPatientProblems();
        }, showError);
      }

      function canSaveNewProblem() {
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

	    function activate(){
        Problem.getActiveList(function(problems){
          vm.problems = problems;
        }, displayComunicationError);
        searchFamilyPatientProblems();
        searchPatientProblems();
        if(vm.newPatientProblem){
          vm.showNewPatientProblem = true;
        }
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
        FamilyPatientProblem.getPaginatedForPaciente(filters,function (paginatedResult) {
          vm.familyProblems = paginatedResult.results;
          if(vm.familyPager.currentPage===1){
            vm.familyPager.totalItems = paginatedResult.count;
          }
        },displayComunicationError);
      }
      function searchPatientProblems() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        HCService.getPatientProblems(vm.filters).$promise.then(function (paginatedResult) {
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        });
      }

      function openEditProblemModal(selectedProblem) {
        var modalInstance = $uibModal.open({
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
          if(resolution==='markedError' || resolution==='problemEdited'){
            searchPatientProblems();
          }
        });

      }

      function openNewProblemModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/problems/newPatientProblem.html',
          size: 'md',
          controller: 'NewPatientProblemController',
          controllerAs: 'NewPatientProblemController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='patientProblemCreated'){
            searchPatientProblems();
          }
        });

      }

      function openCloseProblemModal(selectedProblem) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/problems/closeProblemModal.html',
          size: 'md',
          controller: 'CloseProblemModalCtrl',
          controllerAs: 'CloseProblemModalCtrl',
          resolve: {
            patientProblem: function () {
              return selectedProblem;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='problemEdited'){
            searchPatientProblems();
          }
        });

      }



      function openNewFamilyProblemModal() {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/views/patientHCE/problems/newFamilyProblem.html',
          size: 'md',
          controller: 'NewFamilyProblemController',
          controllerAs: 'NewFamilyProblemController',
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='familyProblemCreated'){
            activate();
          }
        });
      }

      function openEditFamilyProblemModal(selectedFamilyProblem) {
        var modalInstance = $uibModal.open({
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
        if(!vm.showNewPatientProblem){
          vm.showNewPatientProblem = true;
          HCService.openNewPatientProblem();
        }
      }

      function cancelNewPatientProblem() {
        vm.showNewPatientProblem = false;
        HCService.clearNewPatientProblem();
      }

      function canEditProblem(problem) {
        if(problem.state == PatientProblem.stateChoices.STATE_ERROR){
          return false;
        }
        return true;
      }


      function showError(error) {
        if(error){
          toastr.error(error.data.detail);
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();