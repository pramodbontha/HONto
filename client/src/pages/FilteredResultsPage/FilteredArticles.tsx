import { ArticleModal } from "@/components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useFilteredArticlesMutation } from "@/services/ArticleApi";
import { setArticles } from "@/slices/ArticleSlice";
import { Article } from "@/types";
import { Button, Card, Col, Pagination, PaginationProps, Row } from "antd";
import { useState } from "react";
import Highlighter from "react-highlight-words";

const FilteredArticles = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [article, setArticle] = useState({} as Article);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [fetchFilteredArticles] = useFilteredArticlesMutation();

  const { articles, articlesCount } = useAppSelector(
    (state: RootState) => state.articles
  );
  const searchBar = useAppSelector((state: RootState) => state.searchBar);
  const values = useAppSelector((state: RootState) => state.form);
  const dispatch = useAppDispatch();

  const openArticleModal = (article: Article) => {
    setArticle(article);
    setIsArticleModalOpen(true);
  };

  const onChange: PaginationProps["onChange"] = async (
    pageNumber,
    newPageSize
  ) => {
    setCurrentPage(pageNumber);
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    try {
      const { data: filteredArticles } = await fetchFilteredArticles({
        searchTerm: searchBar.query,
        number: values.articleNumber,
        text: values.articleText,
        skip: (pageNumber - 1) * newPageSize,
        limit: newPageSize,
      });
      filteredArticles && dispatch(setArticles(filteredArticles));
    } catch (error) {
      console.error(error);
    }
    console.log("Page: ", pageNumber, "Page Size: ", newPageSize);
  };
  return (
    <>
      <div className="pt-0 pl-4 pr-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Articles Found: {articlesCount}</div>

          <Pagination
            showSizeChanger
            current={currentPage}
            pageSize={pageSize}
            total={articlesCount}
            onChange={onChange}
          />
        </div>
        <div className="mt-2 h-[620px] p-2 overflow-y-auto overflow-x-hidden scrollbar-rounded">
          <Row gutter={[16, 16]}>
            {articles &&
              articles?.map((article) => (
                <Col key={article.id} span={24}>
                  <Card
                    title={`Article Number: ${article.number}`}
                    extra={
                      <Button onClick={() => openArticleModal(article)}>
                        More
                      </Button>
                    }
                    className="h-44 drop-shadow-md"
                  >
                    <div className="flex">
                      <div className="line-clamp-3">
                        <Highlighter
                          highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                          searchWords={[searchBar.query]}
                          autoEscape={true}
                          textToHighlight={article.text}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      </div>
      <div className="mt-4 pb-4 flex justify-end pr-4">
        <Pagination
          showSizeChanger
          current={currentPage}
          pageSize={pageSize}
          total={articlesCount}
          onChange={onChange}
        />
      </div>
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={article}
      />
    </>
  );
};

export default FilteredArticles;
