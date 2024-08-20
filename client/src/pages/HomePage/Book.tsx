import { BookModal } from "@/components";
import { useGetBooksQuery } from "@/services/BookApi";
import { Book as BookType } from "@/types";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { useState } from "react";

const Book = () => {
  const { data: books, error, isLoading } = useGetBooksQuery();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({} as BookType);
  const [current, setCurrent] = useState(1);

  const pageSize = 3;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  const handleNext = () => {
    if (books && current < Math.ceil(books.length / pageSize)) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  let currentPageBooks;

  if (books) {
    currentPageBooks = books.slice(
      (current - 1) * pageSize,
      current * pageSize
    );
  }

  const openBookModal = (book: BookType) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
  };

  return (
    <>
      {books && (
        <div className="p-4">
          <div className="font-semibold">Recommended Books</div>
          <div className="mt-2 flex">
            <Button
              className="mt-16 mr-2"
              onClick={handlePrev}
              disabled={current === 1}
              icon={<CaretLeftOutlined />}
              type="text"
            ></Button>
            <div style={{ width: "100%" }}>
              <Row gutter={[16, 16]}>
                {currentPageBooks?.map((book) => (
                  <Col key={book.id} span={8}>
                    <Card
                      title={book.id}
                      className=" h-44 drop-shadow-md"
                      extra={
                        <Button onClick={() => openBookModal(book)}>
                          More
                        </Button>
                      }
                    >
                      <div className="line-clamp-3">{book.text}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            <Button
              onClick={handleNext}
              className="mt-16 ml-2"
              disabled={current === Math.ceil(books.length / pageSize)}
              icon={<CaretRightOutlined />}
              type="text"
            ></Button>
          </div>
        </div>
      )}
      {isBookModalOpen && (
        <BookModal
          book={selectedBook}
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
        />
      )}
    </>
  );
};

export default Book;
