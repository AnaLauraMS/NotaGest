// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'NotaGest API',
      version: '1.0.0',
      description:
        'Documentação da API do projeto NotaGest. Aqui você encontra os endpoints para autenticação, upload de arquivos e gerenciamento de imóveis.',
    },
    servers: [
        // 🚀 1. BACKEND PRINCIPAL (Geralmente porta 5000)
        { 
          url: 'https://api.notagest.com/api', // <-- **SUBSTITUA PELO DOMÍNIO REAL DO SEU BACKEND/API PRINCIPAL**
          description: 'Servidor de Produção - Backend Principal (Usuários, Imóveis, Arquivos)' 
        },
        // 🚀 2. MICROSSERVIÇO DE AUTENTICAÇÃO (Geralmente porta 5001)
        {
          url: 'https://auth.notagest.com/api/auth', // <-- **SUBSTITUA PELO DOMÍNIO REAL DO SEU SERVIÇO DE AUTH**
          description: 'Servidor de Produção - Microsserviço de Autenticação'
        },
        // Servidor local (mantido para desenvolvimento)
        { 
          url: 'http://localhost:5000', 
          description: 'Servidor Local (Backend Principal)' 
        },
        {
            url: 'http://localhost:5001',
            description: 'Servidor Local (Microsserviço Auth)'
        }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Use o token JWT: Bearer <seu_token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          example: {
            _id: '671a9a2239fbd101bf4d3cc5',
            name: 'Ana Laura',
            email: 'ana@example.com',
            createdAt: '2025-10-20T12:00:00Z',
          },
        },
        Arquivo: {
          type: 'object',
          example: {
            _id: '671a9b5d39fbd101bf4d3cc7',
            user: '671a9a2239fbd101bf4d3cc5',
            title: 'Nota fiscal de cimento',
            value: 350.5,
            purchaseDate: '2025-09-01',
            property: 'Obra da Casa Nova',
            category: 'Materiais',
            subcategory: 'Construção',
            observation: 'Compra feita na loja ConstruMais',
            filePath: '/uploads/1718205958340-nota-cimento.pdf',
          },
        },
        Imovel: {
          type: 'object',
          example: {
            _id: '671a9cdd39fbd101bf4d3cca',
            nome: 'Casa Nova',
            cep: '18040-300',
            rua: 'Rua das Palmeiras',
            numero: '123',
            bairro: 'Centro',
            cidade: 'Sorocaba',
            estado: 'SP',
            tipo: 'Residencial',
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./controllers/*.js', './routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;