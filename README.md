# ServidoresAPI

## Visão Geral do Projeto

Este projeto consiste em uma API backend (`ServidoresAPI`) construída com ASP.NET Core e um frontend (`app-servidores`) desenvolvido com Angular. O objetivo principal é fornecer uma plataforma para gerenciar informações sobre servidores, permitindo funcionalidades como listagem, cadastro, edição, inativação, reativação e exclusão de servidores.

**Funcionalidades Principais:**

* Listagem de servidores ativos e inativos.
* Filtragem de servidores por nome, órgão e lotação.
* Cadastro de novos servidores.
* Edição de informações de servidores existentes.
* Inativação (exclusão lógica) e reativação de servidores.
* Exclusão permanente de servidores.
* Documentação da API utilizando Swagger.

## Decisões Técnicas

Esta seção detalha algumas das principais decisões técnicas tomadas durante o desenvolvimento do projeto.

* **Framework/Biblioteca Principal (Backend):** ASP.NET Core. A inclusão de `builder.Services.AddEndpointsApiExplorer();` e `builder.Services.AddSwaggerGen();` ASP.NET Core para o backend, com Swagger para documentação da API.O **Entity Framework Core** é utilizado como ORM para facilitar a interação com o banco de dados.
* **Framework/Biblioteca Principal (Frontend):** Angular. 
* **Padrão de Projeto (Backend):** padrão MVC para APIs.
* **Padrão de Projeto (Frontend):** Componentes e Serviços.
* **Gerenciamento de Pacotes:** .NET usa NuGet, Angular usa npm. Os arquivos `package.json` e o `.sln` confirmam isso.
* **UI Library:** Angular Material.
* **Server-Side Rendering (SSR):** 


## Estrutura do Código


**Backend (ServidoresAPI - ASP.NET Core):**

ServidoresAPI/
├── Controllers/         # Lógica de controle da API (recebe as requisições)
├── Models/              # Definição das classes de modelo de dados
├── Services/            # Lógica de negócios e serviços da aplicação
├── Data/                # Camada de acesso a dados (ex: Contexto do Entity Framework)
├── Dtos/                # Objetos de transferência de dados
├── ServidoresAPI.csproj   # Arquivo de projeto do ASP.NET Core
├── Program.cs           # Ponto de entrada da aplicação
├── appsettings.json     # Configurações da aplicação
└── ...


**Frontend (app-servidores - Angular):**

app-servidores/ 
├── src/
│   ├── app/
│   │   ├── components/    # Componentes da interface do usuário (ex: servidores-list, servidor-item, etc.)
│   │   ├── services/      # Serviços para lógica de negócios e comunicação com o backend (ex: servidor.service.ts)
│   │   ├── models/        # Definição das classes de modelo de dados do frontend (ex: servidor.model.ts)
│   │   ├── app.module.ts  # Módulo principal da aplicação
│   │   ├── app-routing.module.ts # Configuração de rotas
│   │   └── ...
│   ├── assets/          # Recursos estáticos (imagens, etc.)
│   ├── environments/    # Configurações de ambiente (desenvolvimento, produção)
│   ├── index.html       # Página HTML principal
│   ├── main.server.ts   # Ponto de entrada para o SSR
│   └── ...
├── angular.json       # Configuração do Angular CLI
├── package.json       # Dependências do projeto
├── package-lock.json  # Lock das versões das dependências
├── tsconfig.json        # Configuração do TypeScript
└── ...


## Documentação da API (Swagger)

Este projeto utiliza o Swagger para documentar e testar a API do backend.

**Como Acessar a Documentação:**

1.  Certifique-se de que a sua aplicação backend (`ServidoresAPI`) está em execução.
2.  Abra o seu navegador web.
3.  Acesse o endpoint do Swagger. A URL padrão é `/swagger` após a URL base da sua aplicação backend.

    * Com base no arquivo `launchSettings.json` que você compartilhou anteriormente, as URLs podem ser `http://localhost:5130/swagger` ou `https://localhost:7128/swagger`.

**Como Usar o Swagger UI:**

Ao acessar a URL do Swagger, você verá uma interface interativa que permite:

* **Visualizar os Endpoints da API:** Todos os endpoints disponíveis (rotas) serão listados, juntamente com os métodos HTTP (GET, POST, PUT, DELETE, etc.).
* **Entender os Modelos de Dados:** Você poderá ver a estrutura dos objetos de requisição e resposta (schemas) utilizados pela API.
* **Testar os Endpoints Diretamente:** O Swagger UI permite que você envie requisições para a API e visualize as respostas, sem a necessidade de usar ferramentas externas como Postman ou Insomnia. Para isso:
    1.  Clique em um endpoint para expandi-lo.
    2.  Clique no botão "Try it out".
    3.  Preencha os parâmetros necessários.
    4.  Clique no botão "Execute".
    5.  A resposta da API será exibida abaixo, incluindo o código de status, headers e o corpo da resposta.

## Como Executar o Projeto

**Pré-requisitos:**

* [.NET SDK](https://dotnet.microsoft.com/download) (versão compatível com o seu projeto).
* [Node.js](https://nodejs.org/) (versão recomendada para Angular).
* [Angular CLI](https://angular.io/cli) (você pode instalar globalmente com `npm install -g @angular/cli`).

**Passos para Execução:**

1.  **Backend (ServidoresAPI):**
    * Navegue até a pasta do projeto backend (`ServidoresAPI/`).
    * Execute o comando para restaurar as dependências: `dotnet restore`.
    * Execute o comando para rodar a aplicação: `dotnet run`.
    * Verifique se a aplicação está rodando nas URLs especificadas (ex: `http://localhost:5130` ou `https://localhost:7128`).

2.  **Frontend (app-servidores):**
    * Navegue até a pasta do projeto frontend (`app-servidores/`).
    * Execute o comando para instalar as dependências: `npm install`.
    * Execute o comando para rodar a aplicação de desenvolvimento: `ng serve`.
    * A aplicação frontend estará geralmente disponível em `http://localhost:4200`.


## Autor

[**Eduardo Ribeiro Santana.**]

---

