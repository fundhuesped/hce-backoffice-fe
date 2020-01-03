(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceArvTreatmentList', hceArvTreatmentList);

  /** @ngInject */
  function hceArvTreatmentList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/views/patientHCE/medications/patientARVTreatmentList.html',
      controller: 'PatientARVTreatmentListController',
      controllerAs: 'PatientARVTreatmentListController',
      scope: true,
    };

    return directive;
  }

})();
