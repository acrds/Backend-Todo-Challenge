import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ToBee API",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Users",
        description: "Endpoints for managing users",
      },
      {
        name: "Projects",
        description: "Endpoints for managing projects",
      },
      {
        name: "States",
        description: "Endpoints for managing states",
      },
      {
        name: "Tasks",
        description: "Endpoints for managing tasks",
      },
      {
        name: "Task States",
        description: "Endpoints for managing task states",
      },
      {
        name: "Comments",
        description: "Endpoints for managing comments",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpecs = swaggerJsdoc(swaggerOptions);
