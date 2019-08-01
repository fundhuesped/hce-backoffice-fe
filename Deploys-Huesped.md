### Accesos a la instancia de Centro Medico Huesped por SSH:
direccion: hce-dev.eastus.cloudapp.azure.com
puerto: 5432
username: hueped
password: HuesApi2016!


### Para deploy de FE:

#En tu maquina ejecutar:
gulp clean
gulp pack 
#Eso genera un dist.zip en la carpeta release

#Copiar el archivo a la instancia, password HuesApi2016!
scp release/dist.zip hueped@hce-dev.eastus.cloudapp.azure.com:/tmp 

-> Ingresar a la instancia: 
ssh hueped@hce-dev.eastus.cloudapp.azure.com

-> Suplantar root:
sudo su -
#Misma pass que al ingresar

#Ejecutar deployfe.sh
./deployfe.sh

### Para deploy BE:
# Loguearse en el server 

# Suplantar root password: HuesApi2016!

# Ir a la carpeta /hce-infra/src/hce-backoffice-be
cd /hce-infra/src/hce-backoffice-be

# Pullear cambios
git pull --force

# Redeployar todo el BE
cd /hce-infra
source setenv.sh  #Levantar las variables de entorno
./start_docker.sh  #Levantar docker compose
docker ps # Verificar estan levantados los 3 docker

# Correr las background tasks para cerrar las sesiones automaticamente
docker exec -d hcebackoffice_be_1 python manage.py process_tasks

# Para aplicar las migraciones a la base de datos
docker exec -ti hcebackoffice_be_1 /bin/bash
python manage.py migrate


# Modificar Dockerfile mientras restart
docker exec -ti hcebackoffice_be_1 /bin/bash
sed 's/pip33 /pip3 /' Dockerfile > Dockerfile.changed && mv Dockerfile.changed Dockerfile

#setenv.sh
export DBUSER=hceuser
export DBPASSWORD=hce1234
export DBNAME=hce
export SERVERNAME=hce
export APPUSER=hce
