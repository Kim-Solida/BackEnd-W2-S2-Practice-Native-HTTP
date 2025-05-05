// server.js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        let body = '';

        // Collect the data from the form submission
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', () => {
            // Parse the URL-encoded data
            const parsedData = new URLSearchParams(body);
            const name = parsedData.get('name');

            if (name && name.trim() !== '') {
                // Log the name to the console
                console.log(`Received name: ${name}`);

                // Append the name to submissions.txt
                fs.appendFile('submissions.txt', name + '\n', err => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end('Internal Server Error');
                    }

                    // Send a success response
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                      <html>
                        <body>
                          <h1>Thank you for your submission, ${name}!</h1>
                          <p>Your name has been saved successfully.</p>
                        </body>
                      </html>
                    `);
                });
            } else {
                // If the name is empty, send an error message
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end(`
                  <html>
                    <body>
                    <h1>Error: Name field cannot be empty!</h1>
                    </body>
                  </html>
                `);
            }
        });
        return;
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
