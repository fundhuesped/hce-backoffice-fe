(function () {
    'use strict';
    function PreferenceProvider() {
        function PreferenceResource($resource, apiBase) {
            var Preference = $resource(apiBase + 'preferences/:section/:name', {section: '@section', name: '@name'}, {
            });

            return Preference;
        }

        this.$get = ['$resource', 'apiBase', PreferenceResource];
    }

    angular.module('hce.resources').provider('Preference', PreferenceProvider);
})();