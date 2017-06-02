(function () {
    'use strict';
    function ProvinceProvider() {
        function ProvinceResource($resource, apiBase) {
            function transformDataSet(data, headersGetter, status){
              if(status === 200 && data){
                return angular.fromJson(data).results;  
              }else{
                return [];
              }
            }
            var Province = $resource(apiBase + 'comun/province/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
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
                }
            });

            return Province;
        }

        this.$get = ['$resource', 'apiBase', ProvinceResource];
    }

    angular.module('hce.resources').provider('Province', ProvinceProvider);
})();