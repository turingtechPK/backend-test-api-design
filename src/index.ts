import { server } from './server';
import { PORT } from './config/config';

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
