(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceOtherStudiesList', hceOtherStudiesList);

  /** @ngInject */
  function hceOtherStudiesList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/clinicalResults/clinicalResults.html',
      controller: 'PatientClinicalResultsListController',
      controllerAs: 'PatientClinicalResultsListController',
      scope: true,
    };

    return directive;
  }

})();
