require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Client } = require("@notionhq/client");

let app = express();

app.use(cors());
app.use(express.json());

let databaseId = null;

app.post("/add-note", async function (req, res) {
  const text = req.body.text;



  const notion = new Client({
    auth: process.env.NOTION_KEY,
  });

  if (databaseId == null) {
    try {
      databaseId = await createDb(notion);
    } catch (error) {
      return res.json({
        message: "Error",
        data: error,
      });
    }
  }
  

  console.log("databaseId -> ", databaseId);

  const existingDb = await notion.databases.query({
    database_id: databaseId
  });

  console.log(existingDb);


});

app.listen(10000, function () {
  console.log("Started application on port %d", 10000);
});

async function createDb(notion) {
  const response = await notion.databases.create({
    parent: {
      type: "page_id",
      page_id: process.env.NOTION_PAGE_ID,
    },
    title: [
      {
        type: "text",
        text: {
          content: "Saved notes",
        },
      },
    ],
    properties: {
      Name: {
        title: {},
      },
    },
  });

  return response.id;
}
