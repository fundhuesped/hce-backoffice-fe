(function() {
    'use strict';
    function ARVRecetaProvider() {
      function ARVRecetaResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var ARVReceta = $resource(apiBase + 'hce/paciente/:pacienteId/patientARVPrescriptions',{pacienteId:'@pacienteId'},{
          update: {
            method:'PUT'
          },
          get: {
            method: 'GET',
            url: apiBase + 'hce/patientARVPrescriptions/:id',
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

        return ARVReceta;
        
    	}
      this.$get = ['$resource','apiBase',ARVRecetaResource];
    }
  angular.module('hce.resources').provider('ARVReceta',ARVRecetaProvider);
})();