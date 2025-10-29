// config/swaggerConfig.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = process.env.PORT || 5001;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
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

    servers: [
      {
        url: `http://localhost:${PORT}/api/auth`,
        description: 'Servidor local de desenvolvimento',
      },
    ],

    components: {
      // 🔐 Autenticação JWT (opcional para endpoints protegidos)
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido após o login.',
        },
      },

      // 📦 Todos os schemas utilizados nas rotas
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: {
              type: 'string',
              example: 'João da Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao.silva@exemplo.com',
            },
            senha: {
              type: 'string',
              format: 'password',
              example: '123456',
            },
          },
        },
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
                id: { type: 'string', example: '671bcd00f29b2b83a4e1a8f3' },
                email: { type: 'string', example: 'joao.silva@exemplo.com' },
              },
            },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string', example: 'joao.silva@exemplo.com' },
            senha: { type: 'string', example: '123456' },
          },
        },
        LoginSuccess: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login realizado com sucesso!' },
            token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWJjZDAwZjI5YjJiODNhNGUxYThmMyIsImlhdCI6MTcyOTg2MDAzMywiZXhwIjoxNzI5ODYzNjMzfQ.q8U4VtErhzlkRyaR-MDRIbg8D0Q9nmVpo5rREsPdKDs',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciais inválidas.' },
          },
        },
      },
    },
  },

  // Caminhos dos arquivos com anotações OpenAPI
  apis: ['./routes/*.js', './controllers/auth/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger rodando em: http://localhost:${PORT}/api-docs`);
};

module.exports = setupSwagger;
