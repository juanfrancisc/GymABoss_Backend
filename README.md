# MyGym_HACKaBOSS
Repositorio para el proyecto final de Hack a Boss

Para montar servidor express, creamos una carpeta en nuestro PC, dentro de ella abrimos la terminal de bash o la terminal en VS Code y ejecutamos:

1: npm init -y //->para iniciar el repositorio de trabajo para node

2: npm i eslint prettier -D //->Instalamos el modulo de eslint y prettier

3: npm i express //-> Con esto montamos el server

4: npm i mysql2 //-> Acceso a base de datos

5: npm i dotenv //-> Para crear un archivo en la raiz del proyecto para guardar variables de entorno

6: npm i bcrypt //-> Para poder encriptar contraseñas

7: npm i jsonwebtoken //-> Para poder crear un token de incio de sesion

8: npm i morgan -D //-> Dependencia de desarrollo para obtener mas info en consola

9: npm i express-fileupload //-> Para leer los ficheros que se envian al servedir

10: npm i sharp //-> Para la utilizacion de imagenes

11: npm i uuid //-> Para generar nombre unicos a ficheros

12: npm i nodemailer //-> //Para el envio de correos electronicos

13: npm i nodemon -D //-> Ejecutar para no tener que parar el servidor y iniciar de manera manual el server
	
14: Copiar de otro proyecto:
	.eslintrc.json o crear fichero y pegar este codigo:

		{
    		"env": {
        		"commonjs": true,
        		"es2021": true,
        		"node": true
    		},
    		"extends": "eslint:recommended",
    		"parserOptions": {
        		"ecmaVersion": "latest"
    			},
    		"rules": {
        		"no-unused-vars": "off"
    			}
		}
    
	.prettierrc o crear fichero y pegar este codigo:
		{
    		"tabWidth": 4,
    		"useTabs": false,
    		"semi": true,
    		"singleQuote": true
		}

15: Crear .gitignore (todo lo que añadimos a este fichero no sube a github)

	Dentro de el añadir las lineas:
  
	node_modules
  
	.enn

16: Iniciar servidor:

npm run dev

17: Para la base de datos:

npm run createDB //-> Crea la base de datos, es necesario en el fichero .env especificar un usuario con permisos para crear BD y el nombre de la BD

npm run database //-> Para crear las tablas de la base de datos y añadir algunos ejemplos


/** 
Existe un fichero .env.example donde se detalla que hay que crear en el .env

	
