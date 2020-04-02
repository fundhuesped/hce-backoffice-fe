# Historia Clinica Electronica - Frontend
Este repositorio contiene el servidor de interfaz visual de pantallas del sistema de Historia Clinica Electronica


## Despliegues e Instalación en ambientes
En tu maquina local parado en la rama Master ejecutar:
`gulp clean && gulp pack`
Luego hay que enviar el comprimido generado al servidor:
`scp release/dist.zip usuario-del-servidor@direccion-del-servidor:/tmp`

Siendo root en el servidor a elección en la raiz del mismo, crear un archivo llamado "deploy.sh" con el siguiente contenido:

>>>
rm -rf /carpeta-donde-guardar-frontend/*
cd /carpeta-donde-guardar-frontend
cp /tmp/dist.zip .
unzip dist.zip  
mv dist/* .
cd -


De esta manera cada vez que se desea actualizar el codigo solo debe ejecutarse:
`./deployfe.sh`
Nota: Recuerde debe ser usuario root y estar en la misma ubicacion que el archivo
