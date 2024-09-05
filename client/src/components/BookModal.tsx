import { useLazyGetSectionsInTocQuery } from "@/services/BookApi";
import { useLazyGetFilteredReferencesQuery } from "@/services/ReferenceApi";
import { Book, Reference } from "@/types";
import {
  Breadcrumb,
  Card,
  Col,
  Input,
  Menu,
  MenuProps,
  Modal,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";

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
  const [filteredReferences, setFilteredReferences] = useState<Reference[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [getSectionsInToc] = useLazyGetSectionsInTocQuery();
  const [getFilteredReferences] = useLazyGetFilteredReferencesQuery();
  const { t } = useTranslation();

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
        references && setFilteredReferences(references);
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
    references && setFilteredReferences(references);
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

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    if (searchTerm && searchTerm.trim() !== "") {
      setSearchTerm(searchTerm);
      const filteredReferences = references.filter(
        (reference) =>
          reference.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reference.context.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReferences(filteredReferences);
    } else {
      setSearchTerm("");
      setFilteredReferences(references);
    }
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
              <div className="font-bold">{t("sections")}</div>
              <div className="h-[630px] bg-slate-100 ">
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
                  {updatedSections.length === 0 && t("no-further-sections")}
                </div>
              </div>
            </div>
            <div className="w-[1500px] ml-4 ">
              <div className="font-bold">{t("references")}</div>
              <div className="flex items-center justify-between -mt-2">
                <div className="mt-3 mb-1 flex">
                  <div className=" bg-gray-200  rounded-full p-1 flex ">
                    <Input
                      placeholder={t("search")}
                      value={searchTerm}
                      variant="borderless"
                      onChange={onSearchInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="h-[600px] bg-slate-100  border-slate-100 rounded-r-lg overflow-y-auto overflow-x-hidden scrollbar-rounded">
                {references.length === 0 && (
                  <div className="p-4">{t("no-references-found")}</div>
                )}
                {references.length !== 0 && (
                  <div className=" ml-2 p-4 ">
                    <div className="mt-2">
                      <Row gutter={[16, 16]}>
                        {filteredReferences?.map((reference, index) => (
                          <Col key={reference.id + index} span={24}>
                            <Card
                              title={reference.text}
                              className="h-44 drop-shadow-md"
                            >
                              <div>
                                <div className="font-bold w-24">
                                  {t("context")}:
                                </div>
                                <div className="line-clamp-3">
                                  <Highlighter
                                    highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
                                    searchWords={[searchTerm]}
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
