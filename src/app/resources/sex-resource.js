(function() {
    'use strict';
    function SexProvider() {
      function SexResource($resource,apiBase) {
        function transformDataSet(data, headersGetter, status){
          if(status === 200 && data){
            return angular.fromJson(data).results;  
          }else{
            return [];
          }
        }      
        var Sex = $resource(apiBase + 'comun/sexType/:id/',{id:'@id'},{
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
              params:{status:'Active'},
              isArray: true,
              transformResponse: transformDataSet
          },
          getInactiveList:{
              method: 'GET',
              params:{status:'Inactive'},
              isArray: true,
              transformResponse: transformDataSet
          },
          query:{
              method: 'GET',
              isArray: true,
              transformResponse: transformDataSet
          }
        });

        return Sex;
    	}
      this.$get = ['$resource','apiBase',SexResource];
    }
  angular.module('hce.resources').provider('Sex',SexProvider);
})();