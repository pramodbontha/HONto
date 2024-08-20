import { Modal, Tabs } from "antd";
import { Article } from "@/types";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Highlighter from "react-highlight-words";

interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal = (props: ArticleModalProps) => {
  const { article, isOpen, onClose } = props;
  const searchBar = useAppSelector((state: RootState) => state.searchBar);

  return (
    <>
      <Modal
        title={`Article Number: ${article.number}`}
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
        width={1200}
        footer={null}
      >
        <div className="h-[520px]">
          <Tabs defaultActiveKey="1" className="h-full">
            <Tabs.TabPane tab="Summary" key="1" className="h-full">
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
