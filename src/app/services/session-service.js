(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('hce.services')
        .service('SessionService', SessionService );

    SessionService.$inject = ['Token', 'User', '$state', 'localStorageService', 'Permission', '$q'];

        function SessionService(Token, User, $state,localStorageService, Permission, $q){
        var srv = this;
        srv.login = login;
        srv.logout = logout;
        srv.currentUser = null;
        srv.currentToken = null;
        srv.changePassword = changePassword;
        srv.checkPermission = checkPermission;
        var ADMINISTRATOR = 'administrador';
        var MEDIC = 'medico';
        var SECRETARY = 'secretaria';
        activate();

        function activate(){
            if(localStorageService.get('currentUser')){
                srv.currentUser = localStorageService.get('currentUser');
                srv.currentToken = localStorageService.get('currentToken');
            }
        }

        function changePassword(oldPassword, newPassword, repeatNewPassword, callOK, callNOK){
            User.changePassword({ 
                                    old_password: oldPassword,
                                    new_password1: newPassword, 
                                    new_password2: repeatNewPassword
                                },function(){
                callOK();
            },function(error){
                callNOK(error);
            });
        }

        function saveMaximumPermissionsGroup(groupName){
            if( (groupName===ADMINISTRATOR) || (srv.maxPermissionsGroup===ADMINISTRATOR) ){
                srv.maxPermissionsGroup = groupName;
                return;
            }

            if( (groupName===MEDIC) || (srv.maxPermissionsGroup===MEDIC) ){
                srv.maxPermissionsGroup = groupName;
                return;
            }

            if( (groupName===SECRETARY) || (srv.maxPermissionsGroup===SECRETARY) ){
                srv.maxPermissionsGroup = groupName;
                return;
            }
            //Put New roles here
        }

        function login(username, password, rememberMe, callOK, callNOK){
            Token.login(username, password).then(function(response){
                srv.currentUser = response.data;
                var headers = response.headers();
                srv.currentToken = headers['auth-token'];
                for (var i = srv.currentUser.groups.length - 1; i >= 0; i--) {
                    saveMaximumPermissionsGroup(srv.currentUser.groups[i].name);
                }

                localStorageService.set('currentUser', srv.currentUser);
                localStorageService.set('currentToken', srv.currentToken);
                callOK(response.data);   
            },function(error){
                callNOK(error);
            });
        }

        function checkPermission(perm) {
            console.debug("--- Going to check permission ", perm);
            return $q(function(resolve, reject) {
                return Permission.currentUserCan({ permission: perm },
                    function(response){
                        console.warn(response);
                        resolve(response.hasPerm);
                    },function(error){
                        console.error("--- Error al verificar permisos ---");
                        if(error) console.error(error);
                        reject(response.hasPerm);
                    });
            });
        }

        function logout(){
            srv.currentUser = null;
            srv.token = null;
            srv.currentUser = localStorageService.remove('currentUser');
            $state.transitionTo('login');
        }
    }
})();