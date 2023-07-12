# BackendTest

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local.

```shell
git clone https://github.com/Victoriamsilva/backend-test.git
cd backend-test
npm install
nest start
```

Base de dados: MongoDB

```shell
  mongo
  use db
  db.createCollection('opportunities')
```

É necessário criar um arquivo .env na raiz do projeto seguindo o seguinte template:

```shell
  PIPEDRIVE_URL='https://[seu dominio].pipedrive.com/v1/'
  PIPEDRIVE_TOKEN='?api_token=[token do pipedrive]'
  BLING_URL='https://bling.com.br/Api/v2/'
  BLING_TOKEN='?apikey=[apikey do bling]'
  DB_URL='mongodb://127.0.0.1:27017/db'
```

## Endpoints

- Retorna todas as oportunidades - Get - http://localhost:3000/opportunities

- Cria as oportunidades ganhas do pipedrive no banco de dados e no bling - Post - http://localhost:3000/opportunities

## 🛠️ Construído com

- [Nest](https://docs.nestjs.com/) - O framework NodeJs utilizado
- [Mongoose](https://mongoosejs.com/docs/) - Para a conexão com o banco de dados
