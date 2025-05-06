const express = require('express');
const routes = require('./routes/index');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 