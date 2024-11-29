export const config = {
  server: {
    APPLICATION_NAME: process.env.APPLICATION_NAME,
    PORT: process.env.PORT || 3000,
    HOST_SERVER: `${process.env.HOST}:${process.env.PORT}`,
    // Logger
    LOGGER: process.env.LOGGER,
  },
};
