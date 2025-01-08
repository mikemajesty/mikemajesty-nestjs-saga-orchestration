## Startup para Nestjs do Curso: Arquitetura de Microsserviços: Padrão Saga Orquestrado(Victor Hugo Negrisoli)

### Project setup

```bash
$ npm install
```

### Compile and run the project

```bash
$ docker-compose up --build
```

### Informações

```
Configuração feita até a aula: 
22. Subindo a versão inicial com Docker-compose!
da Seção: Seção 3: Preparando o ambiente de desenvolvimento
```

#### Linux bug, run this commnad on docker kafka image
```
apk update && apk add --no-cache libc6-compat
ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
```


Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
