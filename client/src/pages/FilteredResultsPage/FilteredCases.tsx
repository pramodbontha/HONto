import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setCases } from "@/slices/CaseSlice";
import { ICase } from "@/types";

import { Button, Card, Col, Pagination, PaginationProps, Row } from "antd";
import { useState } from "react";
import { CaseModal } from "@/components";
import { useFilteredCasesMutation } from "@/services/CaseApi";
import Highlighter from "react-highlight-words";

const FilteredCases = () => {
  const [isCaseModelOpen, setIsCaseModelOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState({} as ICase);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [fetchFilteredCases] = useFilteredCasesMutation();
  const { cases, casesCount } = useAppSelector(
    (state: RootState) => state.cases
  );

  const searchBar = useAppSelector((state: RootState) => state.searchBar);

  const values = useAppSelector((state: RootState) => state.form);
  const dispatch = useAppDispatch();

  const openCaseModal = (selectedCase: ICase) => {
    setSelectedCase(selectedCase);
    setIsCaseModelOpen(true);
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
      const { data: filteredCases } = await fetchFilteredCases({
        searchTerm: searchBar.query,
        name: values.caseName,
        number: values.caseNumber,
        judgment: values.caseJudgement,
        facts: values.caseFacts,
        reasoning: values.caseReasoning,
        headnotes: values.caseHeadnotes,
        startYear: values?.caseYear && values?.caseYear[0]?.format("YYYY"),
        endYear: values?.caseYear && values?.caseYear[1]?.format("YYYY"),
        skip: (pageNumber - 1) * newPageSize,
        limit: newPageSize,
      });
      filteredCases && dispatch(setCases(filteredCases));
    } catch (error) {
      console.error(error);
    }
  };

  const DisplayCaseSection = ({ selectedCase }: { selectedCase: ICase }) => {
    let displaySectionTitle = "";
    let displaySectionText = "";

    if (
      selectedCase.judgment &&
      selectedCase.judgment.trim() !== "" &&
      selectedCase.judgment.includes(searchBar.query)
    ) {
      displaySectionTitle = "Judgment: ";
      displaySectionText = selectedCase.judgment;
    } else if (
      selectedCase.facts &&
      selectedCase.facts.trim() !== "" &&
      selectedCase.facts.includes(searchBar.query)
    ) {
      displaySectionTitle = "Facts: ";
      displaySectionText = selectedCase.facts;
    } else if (
      selectedCase.reasoning &&
      selectedCase.facts.trim() !== "" &&
      selectedCase.reasoning.includes(searchBar.query)
    ) {
      displaySectionTitle = "Reasoning: ";
      displaySectionText = selectedCase.reasoning;
    } else if (
      selectedCase.headnotes &&
      selectedCase.headnotes.trim() !== "" &&
      selectedCase.headnotes.includes(searchBar.query)
    ) {
      displaySectionTitle = "Headnotes: ";
      displaySectionText = selectedCase.headnotes;
    }
    return (
      <>
        <div className="line-clamp-3">
          <span className="font-bold w-24">{displaySectionTitle}</span>
          <Highlighter
            highlightClassName="bg-gray-200 text-black font-bold p-1 rounded-lg"
            searchWords={[searchBar.query]}
            autoEscape={true}
            textToHighlight={displaySectionText}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="pt-0 pl-4 pr-4">
        <div className="flex justify-between items-center">
          <div className="font-semibold">Cases Found: {casesCount}</div>

          <Pagination
            showSizeChanger
            current={currentPage}
            pageSize={pageSize}
            total={casesCount}
            onChange={onChange}
            onShowSizeChange={onChange}
          />
        </div>
        <div className="mt-2 h-[620px] p-2 overflow-y-auto overflow-x-hidden scrollbar-rounded">
          <Row gutter={[16, 16]}>
            {cases?.map((cases, index) => (
              <Col key={cases.id + index} span={24}>
                <Card
                  title={`Case Number: ${cases.number}`}
                  extra={
                    <Button onClick={() => openCaseModal(cases)}>More</Button>
                  }
                  className="h-44 drop-shadow-md"
                >
                  <div className="flex">
                    <div className="font-bold w-24">{"Case Name: "}</div>
                    <div className="line-clamp-1">{cases.caseName}</div>
                    <div className="ml-4">
                      <span className="font-semibold">Year:</span>
                      <span>{cases.year}</span>
                    </div>
                  </div>
                  <div className="line-clamp-3 mt-1">
                    <DisplayCaseSection selectedCase={cases} />
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
          total={casesCount}
          onChange={onChange}
        />
      </div>
      <CaseModal
        cases={selectedCase}
        isOpen={isCaseModelOpen}
        onClose={() => setIsCaseModelOpen(false)}
      />
    </>
  );
};

export default FilteredCases;
