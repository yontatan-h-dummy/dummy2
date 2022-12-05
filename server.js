//load environment variables
const dotenv = require("dotenv");
dotenv.config();

const cloudinary = require("cloudinary").v2;
const express = require("express");
const mysql2 = require("mysql2");

//image cloud storage setup
cloudinary.config({ secure: true });

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
  const imageUrl = await uploadImageAndGetUrl("light-bulb.png");

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
      <img src="${imageUrl}" alt="a light bulb">
      <ol> ${listItems}</ol>
    </body>
  </html>`);
}

async function getBlogs() {
  const result = await pool.promise().execute(`SELECT * FROM blog`);
  const rows = result[0];
  return rows;
}
async function uploadImageAndGetUrl(fileName) {
  const filePath = __dirname + "/" + fileName;

  try {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };
    const result = await cloudinary.uploader.upload(filePath, options);
    console.log(result);
    return result.secure_url;
  } catch (e) {
    console.log(e);
    return "6454";
  }
}
