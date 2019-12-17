(function () {
  'use strict';
  function PatientClinicalResultProvider() {
    function PatientClinicalResultResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientClinicalResult = $resource(apiBase + 'hce/paciente/:pacienteId/clinicalStudyResults', null, {
          update: {
            url: apiBase+'hce/patientClinicalStudyResult/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getAllForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/clinicalStudyResults',
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },

          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/clinicalStudyResults',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/clinicalStudyResults',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          delete: {
            url: apiBase+'hce/patientClinicalStudyResult/:id/',
            method: 'DELETE',
            params:{id:'@id'}
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/clinicalStudyResults',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      PatientClinicalResult.stateChoices = {
        STATE_ACTIVE: 'Active',
        STATE_ERROR: 'Error'
      };
      return PatientClinicalResult;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientClinicalResultResource];
  }

  angular.module('hce.resources').provider('PatientClinicalResult', PatientClinicalResultProvider);
})();
