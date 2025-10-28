// Importação dos módulos necessários para o Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 1️⃣ Definição das opções e metadados do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versão da especificação OpenAPI
    info: {
      title: 'Microsserviço de Autenticação - NotaGest',
      version: '1.0.0',
      description:
        'Microsserviço responsável pela autenticação de usuários (registro e login), com geração e validação de tokens JWT.',
      contact: {
        name: 'Equipe NotaGest',
        email: 'contato@notagest.com',
      },
    },

    // 2️⃣ Configuração dos servidores disponíveis
    servers: [
    {
        // 💡 Substitua pelo seu domínio REAL do Backend Principal
        url: 'https://api.notagest.com/api', 
        description: 'Servidor de Produção'
    },
    {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: 'Servidor Local'
    }
],

    // 3️⃣ Componentes globais (schemas e segurança)
    components: {
      securitySchemes: {
        // Esquema para autenticação via Bearer Token (JWT)
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Token JWT obtido após o login. Enviar no cabeçalho Authorization como "Bearer {token}".',
        },
      },

      // 📦 Schemas reutilizáveis para requisições e respostas
      schemas: {
        // 🔹 Esquema de entrada para registro de novo usuário
        RegisterInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: {
              type: 'string',
              description: 'Nome completo do novo usuário.',
              example: 'João da Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Endereço de e-mail único do usuário.',
              example: 'joao.silva@exemplo.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (mínimo 6 caracteres).',
              example: 'minhasenhasecreta123',
            },
          },
        },

        // 🔹 Esquema de entrada para login
        LoginInput: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'E-mail cadastrado do usuário.',
              example: 'joao.silva@exemplo.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha cadastrada do usuário.',
              example: 'minhasenhasecreta123',
            },
          },
        },

        // 🔹 Esquema de resposta de sucesso no registro
        RegisterSuccess: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Usuário criado com sucesso e perfil sincronizado!',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '671bcd00f29b2b83a4e1a8f3',
                },
                email: {
                  type: 'string',
                  example: 'joao.silva@exemplo.com',
                },
              },
            },
          },
        },

        // 🔹 Esquema de resposta de sucesso no login
        LoginSuccess: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login realizado com sucesso!',
            },
            token: {
              type: 'string',
              description: 'Token JWT válido para autenticação.',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWJjZDAwZjI5YjJiODNhNGUxYThmMyIsImlhdCI6MTcyOTg2MDAzMywiZXhwIjoxNzI5ODYzNjMzfQ.q8U4VtErhzlkRyaR-MDRIbg8D0Q9nmVpo5rREsPdKDs',
            },
          },
        },

        // 🔹 Esquema genérico de erro
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Credenciais inválidas.',
            },
          },
        },
      },
    },
  },

  // 4️⃣ Caminhos dos arquivos que contêm as anotações JSDoc (para gerar a documentação automaticamente)
  apis: ['./routes/*.js', './controllers/auth/*.js'],
};

// 5️⃣ Gera a especificação Swagger com base nas opções
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 6️⃣ Função de configuração do Swagger na aplicação Express
const setupSwagger = (app) => {
  // Rota onde a documentação estará disponível
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('📘 Documentação Swagger disponível em: /api-docs');
};

// Exporta a função para ser usada no server.js
module.exports = setupSwagger;
