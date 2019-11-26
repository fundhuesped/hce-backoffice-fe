(function () {
  'use strict';
  function PatientArvTreatmentProvider() {
    function PatientArvTreatmentResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientArvTreatment = $resource(apiBase + 'hce/paciente/:pacienteId/arvTreatments', null, {
          update: {
            url: apiBase+'hce/patientArvTreatment/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/arvTreatments',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/arvTreatments',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          delete: {
            url: apiBase+'hce/patientArvTreatment/:id/',
            method: 'DELETE',
            params:{id:'@id'}
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/arvTreatments',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          },
          getAllForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/arvTreatments',
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },
      });


      PatientArvTreatment.stateChoices = {
        STATE_ACTIVE: 'Active',
        STATE_CLOSED: 'Closed',
        STATE_ERROR: 'Error'
      };

      return PatientArvTreatment;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientArvTreatmentResource];
  }

  angular.module('hce.resources').provider('PatientArvTreatment', PatientArvTreatmentProvider);
})();
