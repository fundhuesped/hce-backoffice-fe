(function () {
    'use strict';
    function HIVDataProvider() {
        function HIVDataResource($resource, apiBase) {
            function transformDataSet(data, headersGetter, status){
              if(status === 200 && data){
                return angular.fromJson(data).results;  
              }else{
                return [];
              }
            }
            var HIVData = $resource(apiBase + 'laboratory/paciente/:patientId/', {id: '@patientId'}, {
                getCD4: {
                  method: 'GET',
                  params:  {id: '@patientId'},
                  url: apiBase + 'laboratory/paciente/:patientId/cd4',
                  isArray: false
                },
                getCV: {
                  method: 'GET',
                  params:  {id: '@patientId'},
                  url: apiBase + 'laboratory/paciente/:patientId/cv',
                  isArray: false
                },
                getHIVChart: {
                  method: 'GET',
                  params:  {id: '@patientId'},
                  url: apiBase + 'hce/paciente/:patientId/hivChart',
                  isArray: false
                }
            });

            return HIVData;
        }

        this.$get = ['$resource', 'apiBase', HIVDataResource];
    }

    angular.module('hce.resources').provider('HIVData', HIVDataProvider);
})();