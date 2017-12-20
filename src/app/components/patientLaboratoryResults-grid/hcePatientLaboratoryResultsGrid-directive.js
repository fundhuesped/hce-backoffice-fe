(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hcePatientLaboratoryResultsGrid', hcePatientLaboratoryResultsGrid);

  /** @ngInject */
  function hcePatientLaboratoryResultsGrid() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/laboratoriesResults/laboratoriesResults.html',
      controller: 'PatientLaboratoryResultsListController',
      controllerAs: 'Ctrl',
      scope: true,
    };

    return directive;
  }

})();
