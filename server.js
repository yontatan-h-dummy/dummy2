const express = require("express");
const mysql2 = require("mysql2");
const dotenv = require("dotenv");

//load environment variables
dotenv.config();

//mysql connection
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
});

//set up web server
const app = express();
app.get("/", handleRequests);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("listening to port: " + PORT));

// heart of the matter
async function handleRequests(req, res) {
  const blogs = await getBlogs();

  let listItems = "";
  for (const blog of blogs) {
    listItems += `
    <li>
      <h2>${blog.title}</h2>
      <p>${blog.content}</p>
    </li>`;
  }

  res.send(`
  <html> 
    <head>
      <title> blogs </title>
    </head>
    <body>
      <h1>Blogs</h1>
      <ol> ${listItems}</ol>
    </body>
  </html>`);
}

async function getBlogs() {
  const result = await pool.promise().execute(`SELECT * FROM blog`);
  const rows = result[0];
  return rows;
}
