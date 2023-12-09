// import http from 'http'
import { app } from "./app";
import contributorsRoutes from './routes/contributorsRoutes';

const server = app;

// github contributors routes
server.use('/api/contributors', contributorsRoutes);

// home page route
server.get('/', (req, res) => {
  res.send('GitHub Contributor Tracker');
});

export { server };

