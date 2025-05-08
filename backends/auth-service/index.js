require('dotenv').config();

const app = require('./src/app');
const logger = require('./src/utils/logger');

const port = process.env.PORT || 3001;

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    console.log(`Server running on port ${port}`);
});