(function () {
  'use strict';
  function PatientVaccineProvider() {
    function PatientVaccineResource($resource, apiBase, $http) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var PatientVaccine = $resource(apiBase + 'hce/paciente/:pacienteId/vaccines', null, {
          update: {
            url: apiBase+'hce/patientVaccine/:id/',
            method: 'PUT',
            params:{id:'@id'}
          },
          getFullList:{
            url: apiBase+'hce/paciente/:pacienteId/vaccines',
            params:{pacienteId:'@pacienteId', all: true},
            method: 'GET',
            isArray: true
          },
          getPaginatedForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/vaccines',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: false
          },
          save: {
            url: apiBase+'hce/paciente/:pacienteId/vaccines',
            method: 'POST',
            params:{pacienteId:'@pacienteId'}
          },
          getAllForPaciente:{
            url: apiBase+'hce/paciente/:pacienteId/vaccines',
            params:{pacienteId:'@pacienteId', all:"True"},
            method: 'GET',
            isArray: true
          },
          getForPaciente: {
            url: apiBase+'hce/paciente/:pacienteId/vaccines',
            params:{pacienteId:'@pacienteId'},
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
          }
      });


      PatientVaccine.stateChoices = {
        STATE_APPLIED: 'Applied',
        STATE_ERROR: 'Error'
      };

      return PatientVaccine;
    }


    this.$get = ['$resource', 'apiBase', '$http', PatientVaccineResource];
  }

  angular.module('hce.resources').provider('PatientVaccine', PatientVaccineProvider);
})();
