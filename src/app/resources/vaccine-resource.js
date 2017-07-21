(function() {
    'use strict';
    function VaccineProvider() {
      function VaccineResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }
        var Vaccine = $resource(apiBase + 'masters/vaccine/:id/',{id:'@id'},{
          update: {
            method:'PUT'
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
        return Vaccine;
    	}
      this.$get = ['$resource','apiBase',VaccineResource];
    }
  angular.module('hce.resources').provider('Vaccine',VaccineProvider);
})();