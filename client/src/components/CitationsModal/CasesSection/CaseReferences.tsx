import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useLazyReferencesWithCaseCountQuery,
  useReferencesWithCaseMutation,
} from "@/services/ReferenceApi";
import {
  setCaseReferences,
  setCaseReferencesCount,
} from "@/slices/ReferenceSlice";
import { Reference } from "@/types";
import {
  Row,
  Col,
  Card,
  Button,
  Pagination,
  PaginationProps,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface CaseReferenceProps {
  caseReferences: Reference[];
  caseId?: string;
  openBookModal: (reference: Reference) => void;
}

const CaseReferences = (props: CaseReferenceProps) => {
  const { caseReferences, caseId, openBookModal } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [getReferencesWithCase] = useReferencesWithCaseMutation();
  const [getCaseReferencesCount] = useLazyReferencesWithCaseCountQuery();

  const { caseReferencesCount } = useAppSelector((state) => state.references);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const debounceDelay = 500; // milliseconds

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setPageSize(10);
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
      const { data: references } = await getReferencesWithCase({
        caseId: `${caseId}` ?? "1",
        searchTerm,
        skip: (pageNumber - 1) * newPageSize,
        limit: newPageSize,
      });

      references && dispatch(setCaseReferences(references));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const { data: references } = await getReferencesWithCase({
        caseId: `${caseId}` ?? "1",
        searchTerm,
        skip: 0,
        limit: pageSize,
      });

      references && dispatch(setCaseReferences(references));

      const { data: referenceCaseCount } = await getCaseReferencesCount({
        caseId: `${caseId}` ?? "1",
        searchTerm,
      });

      referenceCaseCount !== undefined &&
        dispatch(setCaseReferencesCount(referenceCaseCount));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      // Call search after the debounce delay

      caseId && handleSearch();
    }, debounceDelay);

    // Cleanup function to clear the timeout if searchTerm, currentPage, or pageSize changes again
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
      <div className="flex items-center justify-between -mt-4">
        <div className="mt-3 mb-4 flex">
          <div className=" bg-gray-200  rounded-full p-1 flex ">
            <Input
              placeholder={t("search")}
              value={searchTerm}
              variant="borderless"
              onChange={onSearchInputChange}
            />
          </div>
        </div>
        <div>
          {caseReferencesCount > 0 && (
            <div className="mt-2 pb-4 flex justify-end pr-4">
              <Pagination
                showSizeChanger
                current={currentPage}
                pageSize={pageSize}
                total={caseReferencesCount}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className="h-[560px] mb-2 overflow-y-auto overflow-x-hidden scrollbar-rounded">
        <Row gutter={[16, 16]}>
          {caseReferences?.map((reference, index) => (
            <Col key={reference.id + index} span={24}>
              <Card
                title={reference.text}
                extra={
                  <Button onClick={() => openBookModal(reference)}>
                    {t("find-in-book")}
                  </Button>
                }
                className="h-44 drop-shadow-md"
              >
                <div>
                  <div className="font-bold w-24">{t("context")}:</div>
                  <div className="line-clamp-3">{reference.context}</div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default CaseReferences;
