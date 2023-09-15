import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json())

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Welcome to Mern");
});

app.post("/books", async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.author ||
      !req.body.publishYear
    ) {
      return res
        .status(400)
        .send({ message: "Invalid fields: send all fields" });
    }
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        publishYear: req.body.publishYear
    }

    const book = await Book.create(newBook);

    return res.status(201).send(book)

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({})
        return res.status(200).json({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message})
    }
})

app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params

        const book = await Book.findById(id)

        return res.status(200).json(book)
    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message})
    }
})

app.put('/books/:id', async (req,res) => {
    try {
        if (
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
          ) {
            return res
              .status(400)
              .send({ message: "Invalid fields: send all fields" });
          }

          const {id} = req.params

          const result = await Book.findByIdAndUpdate(id, req.body)

          if(!result) {
            return res.status(404).json({message: 'Book not found'})
          }
          return res.status(200).send({message: 'Book updated successfully'})

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

app.delete('/books/:id', async (req, res) => {
    try {
        const {id} = req.params

        const result = await Book.findByIdAndDelete(id)

        if(!result) {
            return res.status(404).json({message: 'Book not found'})
        }

        return res.status(200).send({message: 'Book deleted successfully'})
    } catch (error) {
        console.log(error.message)
        res.status(500).send({message: error.message})
    }
})


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
