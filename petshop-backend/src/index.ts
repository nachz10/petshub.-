import fastify from "./app";

const start = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000 });
    console.log(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
