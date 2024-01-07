const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@cluster0.tcyfwz4.mongodb.net/?retryWrites=true&w=majority`;

/// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  await client.connect();

  const dbName = "dwipayogi";
  const collectionName = "data";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  /*
   *  *** INSERT DOCUMENTS ***
   *
   * You can insert individual documents using collection.insert().
   * In this example, we're going to create four documents and then
   * insert them all in one call with collection.insertMany().
   */

  const taskdata = [
    {
      task: "task4",
      deadline: "2024-05-01",
      time: "13:00",
    },
  ];

  try {
    const insertManyResult = await collection.insertMany(taskdata);
    console.log(
      `${insertManyResult.insertedCount} documents successfully inserted.\n`
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
  }

  /*
   * *** FIND DOCUMENTS ***
   *
   * Now that we have data in Atlas, we can read it. To retrieve all of
   * the data in a collection, we call Find() with an empty filter.
   * The Builders class is very helpful when building complex
   * filters, and is used here to show its most basic use.
   */

  const findAllQuery = {};

  try {
    const cursor = collection.find(findAllQuery);
    let foundData = false;

    await cursor.forEach((data) => {
      console.log(
        `tugas ${data.task} dengan deadline ${data.deadline} jam ${data.time}`
      );
      foundData = true;
    });

    if (!foundData) {
      console.log("tugas tidak ditemukan");
    }
    console.log();
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }

    /*
   * *** UPDATE DOCUMENTS ***
   */

  const updateDoc = { $set: { prepTimeInMinutes: 72 } };
  const findOneQuery = { ingredients: "potato" };

  // The following updateOptions document specifies that we want the *updated*
  // document to be returned. By default, we get the document as it was *before*
  // the update.
  const updateOptions = { returnOriginal: false };

  try {
    const updateResult = await collection.findOneAndUpdate(
      findOneQuery,
      updateDoc,
      updateOptions
    );
    console.log(
      `Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`
    );
  } catch (err) {
    console.error(
      `Something went wrong trying to update one document: ${err}\n`
    );
  }

  /*
   * *** DELETE DOCUMENTS ***
   */

  const deleteQuery = { task: "task4" };
  try {
    const deleteResult = await collection.deleteMany(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong trying to delete documents: ${err}\n`);
  }
  await client.close();
}
run().catch(console.dir);
