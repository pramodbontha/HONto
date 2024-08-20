import { Modal, Tabs } from "antd";
import { ICase } from "@/types";
import Highlighter from "react-highlight-words";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface CaseModalProps {
  cases: ICase;
  isOpen: boolean;
  onClose: () => void;
}

const CaseModal = (props: CaseModalProps) => {
  const { cases, isOpen, onClose } = props;
  const searchBar = useAppSelector((state: RootState) => state.searchBar);
  return (
    <>
      <div>
        <Modal
          title={`Case Number: ${cases.number}`}
          open={isOpen}
          onOk={onClose}
          onCancel={onClose}
          width={1200}
          footer={null}
        >
          <b>Name:</b> {cases.caseName}
          <div className="h-[520px]">
            <Tabs defaultActiveKey="1" className="h-full">
              <Tabs.TabPane tab="Facts" key="1" className="h-full">
                <div className="h-[450px] overflow-y-auto overflow-x-hidden scrollbar-rounded">
                  <Highlighter
                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                    searchWords={[searchBar.query || ""]}
                    autoEscape={true}
                    textToHighlight={cases.facts}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Judgment" key="2" className="h-full">
                <div className="h-[450px] overflow-y-auto overflow-x-hidden scrollbar-rounded">
                  <Highlighter
                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                    searchWords={[searchBar.query || ""]}
                    autoEscape={true}
                    textToHighlight={cases.judgment}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Reasoning" key="3" className="h-full">
                <div className="h-[450px] w-auto overflow-y-auto overflow-x-hidden scrollbar-rounded">
                  <Highlighter
                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                    searchWords={[searchBar.query || ""]}
                    autoEscape={true}
                    textToHighlight={cases.reasoning}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Headnotes" key="4" className="h-full">
                <div className="h-[450px] overflow-y-auto overflow-x-hidden scrollbar-rounded">
                  <Highlighter
                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                    searchWords={[searchBar.query || ""]}
                    autoEscape={true}
                    textToHighlight={cases.headnotes}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CaseModal;
