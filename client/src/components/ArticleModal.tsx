import { Modal, Tabs } from "antd";
import { Article } from "@/types";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";

interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal = (props: ArticleModalProps) => {
  const { article, isOpen, onClose } = props;
  const searchBar = useAppSelector((state: RootState) => state.searchBar);
  const { t } = useTranslation();

  return (
    <>
      <Modal
        title={
          <Highlighter
            highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
            searchWords={[searchBar.query]}
            autoEscape={true}
            textToHighlight={`${t("article-number")}: ${article.number}`}
          />
        }
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
        width={1200}
        footer={null}
      >
        <div className="h-[520px]">
          <div className="flex">
            <div className="font-bold mr-2">{t("name")}:</div>
            <div className="line-clamp-1">
              <Highlighter
                highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                searchWords={[searchBar.query]}
                autoEscape={true}
                textToHighlight={article.name}
              />
            </div>
          </div>
          <Tabs defaultActiveKey="1" className="h-full">
            <Tabs.TabPane tab={t("summary")} key="1" className="h-full">
              <div className="h-[450px] overflow-y-auto scrollbar-rounded">
                <Highlighter
                  highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                  searchWords={[searchBar.query]}
                  autoEscape={true}
                  textToHighlight={article.text}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default ArticleModal;
