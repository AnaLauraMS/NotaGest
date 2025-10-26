const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// 1. Opções de metadados da API (Informações gerais)
const swaggerOptions = {
    // Opções básicas do Swagger (versão OpenAPI, informações da API)
    swaggerDefinition: {
        openapi: '3.0.0', // Versão da especificação OpenAPI
        info: {
            title: 'Microsserviço',
            version: '1.0.0',
            description: 'Endpoints para registro e login de usuários.',
            contact: {
                name: 'NotaGest Team'
            },
        },
        // Configurações globais para todos os endpoints
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5001}/api/auth`, // URL base da sua API
                description: 'Servidor Local de Desenvolvimento'
            }
        ],
        // Definição de Componentes (Schemas e Segurança)
        components: {
            securitySchemes: {
                // Esquema de segurança para endpoints protegidos por JWT
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT obtido após o login. Adicionar "Bearer " antes do token.'
                }
            },
            schemas: {
                // Esquema de entrada para o registro (Ex: Body da requisição)
                RegisterInput: {
                    type: 'object',
                    required: ['nome', 'email', 'senha'],
                    properties: {
                        nome: {
                            type: 'string',
                            description: 'Nome completo do novo usuário.',
                            example: 'João da Silva'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email único do usuário.',
                            example: 'joao.silva@exemplo.com'
                        },
                        senha: {
                            type: 'string',
                            format: 'password',
                            description: 'Senha do usuário (mínimo 6 caracteres).',
                            example: 'minhasenhasecreta123'
                        }
                    }
                },
                // Esquema de entrada para o login
                LoginInput: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do usuário para login.',
                            example: 'joao.silva@exemplo.com'
                        },
                        senha: {
                            type: 'string',
                            format: 'password',
                            description: 'Senha do usuário.',
                            example: 'minhasenhasecreta123'
                        }
                    }
                },
                // Esquema de resposta de sucesso no Login
                LoginSuccess: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Login realizado com sucesso!'
                        },
                        token: {
                            type: 'string',
                            description: 'Token JWT de acesso.',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTdkZj...'
                        }
                    }
                },
                // Esquema de resposta de sucesso no Registro
                RegisterSuccess: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Usuário criado com sucesso e perfil sincronizado!'
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '60a7e0a8b9e6b4001c342f0a' },
                                email: { type: 'string', example: 'joao.silva@exemplo.com' }
                            }
                        }
                    }
                },
            }
        }
    },
    // 2. Opções para encontrar os arquivos com documentação JSDoc
    apis: [
        './routes/*.js', // Busca arquivos de rota
        './controllers/auth/*.js', // Busca arquivos de controller
        // Adicione outros caminhos se você tiver controllers ou modelos em outras pastas
    ], 
};

// 3. Gera a especificação Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 4. Função auxiliar para configurar o Swagger na sua aplicação Express
const setupSwagger = (app) => {
    // Rota que serve a interface do Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Documentação Swagger disponível em: /api-docs');
};

module.exports = setupSwagger;