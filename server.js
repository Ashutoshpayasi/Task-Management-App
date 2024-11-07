const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json()); // Parse JSON bodies

// Mock data for testing
const tasks = [
    { id: 1, title: 'Sample Task', description: 'This is a sample task description' },
    { id: 2, title: 'Another Task', description: 'This is another task description' },
    { id: 2, title: 'Another Task', description: 'This is another task description' },
    { id: 2, title: 'Another Task', description: 'This is another task description' },
    { id: 2, title: 'Another Task', description: 'This is another task description' },
];

// Mount Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET request to retrieve tasks
app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// POST request to create a new task
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
