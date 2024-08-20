import { useLazyGetSectionsInTocQuery } from "@/services/BookApi";
import { useLazyGetFilteredReferencesQuery } from "@/services/ReferenceApi";
import { Book, Reference } from "@/types";
import { Breadcrumb, Card, Col, Menu, MenuProps, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";

interface BookModalProps {
  book?: Book;
  reference?: Reference;
  isOpen: boolean;
  onClose: () => void;
}

const { Item } = Menu;

const BookModal = (props: BookModalProps) => {
  const { book, isOpen, reference, onClose } = props;
  const [selectedKey, setSelectedKey] = useState("articles");
  const [updatedSections, setUpdatedSections] = useState<Book[]>([]);

  // let { data: sections } = useGetSectionsInTocQuery(book?.id || "");
  const [breadCrumbItems, setBreadCrumbItems] = useState<string[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);

  const [getSectionsInToc] = useLazyGetSectionsInTocQuery();
  const [getFilteredReferences] = useLazyGetFilteredReferencesQuery();

  useEffect(() => {
    const getInitialSections = async () => {
      const initialId = reference?.id || book?.id;

      if (initialId) {
        const { data: sections } = await getSectionsInToc(initialId);
        if (sections?.length) {
          setUpdatedSections(sections);
        }
        const { data: references } = await getFilteredReferences(initialId);
        references && setReferences(references);
        setBreadCrumbItems(initialId.split(">"));
      }
    };
    getInitialSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSections = async (
    bookId: string,
    isMenuItem: boolean,
    index: number
  ) => {
    let sectionQueryPath = "";
    if (isMenuItem) {
      if (breadCrumbItems.length !== 0) {
        sectionQueryPath = breadCrumbItems.join(">").trimEnd() + " > " + bookId;
      }
    } else {
      sectionQueryPath = breadCrumbItems.slice(0, index + 1).join(">");
    }
    const { data: updatedSections } = await getSectionsInToc(
      sectionQueryPath.trimEnd().trimStart()
    );
    const { data: references } = await getFilteredReferences(
      sectionQueryPath.trimEnd().trimStart()
    );
    references && setReferences(references);
    setBreadCrumbItems(sectionQueryPath.split(">"));
    if (updatedSections?.length) {
      setUpdatedSections(updatedSections);
    } else {
      setUpdatedSections([]);
    }
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSelectedKey(e.key as string);
    updateSections(e.key as string, true, 0);
  };
  return (
    <>
      <Modal
        title={breadCrumbItems[0]}
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
        width={1800}
        footer={null}
      >
        <div className="h-[700px]">
          {breadCrumbItems.length !== 0 && (
            <Breadcrumb separator=">">
              {breadCrumbItems.map((item, index) => (
                <Breadcrumb.Item key={index}>
                  {index < breadCrumbItems.length - 1 ? (
                    <a onClick={() => updateSections(item, false, index)}>
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}
          <div className="mt-2 p-2 flex">
            <div className="w-[260px] border-slate-100">
              <div className="font-bold">Sections</div>
              <div className="h-[600px] bg-slate-100 ">
                <div className="w-[230px]  ml-2 p-4 ">
                  {updatedSections.length !== 0 && (
                    <Menu
                      onClick={handleMenuClick}
                      selectedKeys={[selectedKey]}
                      mode="inline"
                      className="h-[570px] overflow-y-auto scrollbar-rounded text-center"
                    >
                      {updatedSections?.map((section) => (
                        <Item key={section.text}>{section.text}</Item>
                      ))}
                    </Menu>
                  )}
                  {updatedSections.length === 0 && "No Further Sections Found"}
                </div>
              </div>
            </div>
            <div className="w-[1500px] ml-4 ">
              <div className="font-bold">References</div>
              <div className="h-[600px] bg-slate-100  border-slate-100 rounded-r-lg overflow-y-auto overflow-x-hidden scrollbar-rounded">
                {references.length !== 0 && (
                  <div className="w-[1480px] ml-2 p-4 ">
                    <div className="mt-2">
                      <Row gutter={[16, 16]}>
                        {references?.map((reference, index) => (
                          <Col key={reference.id + index} span={24}>
                            <Card
                              title={reference.id}
                              className="h-44 drop-shadow-md"
                            >
                              <div>
                                <div className="font-bold w-24">
                                  {"Context: "}
                                </div>
                                <div className="line-clamp-3">
                                  <Highlighter
                                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                                    searchWords={[reference.text]}
                                    autoEscape={true}
                                    textToHighlight={reference.context}
                                  />
                                </div>
                              </div>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookModal;
