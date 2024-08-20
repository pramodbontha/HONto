import { ArticleModal } from "@/components";
import { useGetArticlesQuery } from "@/services/ArticleApi";
import { Article as ArticleType } from "@/types";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";
import { useState } from "react";

const Article = () => {
  const { data: articles, isLoading, isError } = useGetArticlesQuery();

  const [current, setCurrent] = useState(1);
  const [animate, setAnimate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [article, setArticle] = useState({} as ArticleType);

  const pageSize = 3;

  const handleNext = () => {
    if (articles && current < Math.ceil(articles.length / pageSize)) {
      setAnimate("animate-slide-out-left");
      setTimeout(() => {
        setCurrent(current + 1);
        setAnimate("animate-slide-in-right");
      }, 300);
    }
  };

  const handlePrev = () => {
    setAnimate("animate-slide-out-right");
    setTimeout(() => {
      setCurrent(current - 1);
      setAnimate("animate-slide-in-left");
    }, 300);
  };

  const openArticleModal = (article: ArticleType) => {
    setArticle(article);
    setIsModalOpen(true);
  };

  let currentPageArticles;

  if (articles) {
    currentPageArticles = articles.slice(
      (current - 1) * pageSize,
      current * pageSize
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      {articles && (
        <div className={`mt-2 p-4`}>
          <div className="font-semibold">Recommended Articles</div>
          <div className="mt-2 flex">
            <Button
              className="mt-16 mr-2"
              onClick={handlePrev}
              disabled={current === 1}
              icon={<CaretLeftOutlined />}
              type="text"
            ></Button>
            <div className="w-full overflow-hidden">
              <Row gutter={[16, 16]}>
                {articles &&
                  currentPageArticles?.map((article) => (
                    <Col
                      key={article.id}
                      span={8}
                      className={` ${animate ? animate : ""}`}
                    >
                      <Card
                        title={`Article Number: ${article.number}`}
                        className="h-44 drop-shadow-md"
                        extra={
                          <Button onClick={() => openArticleModal(article)}>
                            More
                          </Button>
                        }
                      >
                        <div className="line-clamp-3">{article.text}</div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
            <Button
              onClick={handleNext}
              className="mt-16 ml-2"
              disabled={current === Math.ceil(articles.length / pageSize)}
              icon={<CaretRightOutlined />}
              type="text"
            ></Button>
          </div>
        </div>
      )}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={article}
      />
    </>
  );
};

export default Article;
