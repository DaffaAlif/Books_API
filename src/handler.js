const { nanoid } = require("nanoid");

const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt,
    updatedAt,
    finished,
  };

  if (!name || name?.length < 1 || name == null) {
    const response = h.response({
      status: "fail",
      message: `Gagal menambahkan buku. Mohon isi nama buku`,
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: `Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount`,
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess =
    books.filter((book) => book.id === id).length > 0 &&
    name?.length > 1 &&
    readPage <= pageCount;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBookHandler = (request, h) => {
  const { reading, finished, name } = request.query;
  console.log(reading, finished, name);
 
  if (reading) {
    const response = h.response({
      status: "success",
      data: {
        books: books
        .filter((book) => book.reading == reading)
        .map((book) => {
          return { id: book.id, name: book.name, publisher: book.publisher };
        }) 
      },
    });
    response.code(200);
    return response;
  }
  if (finished) {
    const response = h.response({
      status: "success",
      data: {
        books: books
        .filter((book) => book.finished == finished)
        .map((book) => {
          return { id: book.id, name: book.name, publisher: book.publisher };
        })
      },
    });
    response.code(200);
    return response;
  }
  if (name) {
    console.log(books
        )
    const response = h.response({
      status: "success",
      data: {
        books: books
        .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
        .map((book) => {
          return { id: book.id, name: book.name, publisher: book.publisher };
        })
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    data: {
      books: books.map((book) => ({
        id: book?.id,
        name: book?.name,
        publisher: book?.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookbyIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookData = books.find((book) => book.id == bookId);

  if (bookData !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book: bookData,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name?.length < 1 || !name || name == null) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount ? true : false;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
      finished,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookbyIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
