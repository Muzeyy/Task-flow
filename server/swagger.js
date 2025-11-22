const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Flow API Documentation",
      version: "1.0.0",
      description: "API documentation for the Task Flow project",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["./routes/*.js", "./models/*.js"], // <-- scan routes for doc blocks
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs running at: http://localhost:5000/api-docs");
}

module.exports = swaggerDocs;
