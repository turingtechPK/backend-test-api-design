// imported the required packages
const { express, cors, bodyParser} = require("./utils/packages");

// express app
const app = express();

// set corsConfiguration if necessary...
const corsConfiguration = {}

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfiguration));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
const middleware = require('./middlewares/gitHubMiddleware');
const apiRateLimiter = require('./middlewares/rateLimiter');
app.use(middleware.setHeaders);

// routes
const gitHubAPIRoutes = require('./routes/github-api-routes');

// applying rate limiting middleware to API calls only...
app.use('/github_api', apiRateLimiter, gitHubAPIRoutes);

module.exports = app;
