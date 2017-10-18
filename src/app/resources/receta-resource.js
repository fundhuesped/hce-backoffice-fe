(function() {
    'use strict';
    function RecetaProvider() {
      function RecetaResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Receta = $resource(apiBase + 'hce/paciente/:pacienteId/patientPrescriptions',{pacienteId:'@pacienteId'},{
          update: {
            method:'PUT'
          },
          get: {
            method: 'GET',
            url: apiBase + 'hce/patientPrescriptions/:id',
            params: {id:'@id'},
            isArray: false
          },
          getFullActiveList: {
            method: 'GET',
            params: {status: 'Active', all: true},
            isArray: true
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active',page_size:99},
            isArray: true,
            transformResponse: transformDataSet
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive',page_size:99},
            isArray: true,
            transformResponse: transformDataSet
          },
          query:{
            method: 'GET',
            isArray: true,            
            transformResponse: transformDataSet
          },
          queryPaginated:{
           method: 'GET',
           isArray: false
          },
          getPaginatedActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: false
          }
        });

        return Receta;
        
    	}
      this.$get = ['$resource','apiBase',RecetaResource];
    }
  angular.module('hce.resources').provider('Receta',RecetaProvider);
})();