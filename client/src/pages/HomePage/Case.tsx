import { useGetCasesQuery } from "@/services/CaseApi";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";
import { useState } from "react";
import { ICase as CaseType, ICase } from "@/types";
import { CaseModal } from "@/components";

const Case = () => {
  const { data: cases } = useGetCasesQuery();

  const [current, setCurrent] = useState(1);
  const [animate, setAnimate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCase, setModalCase] = useState({} as CaseType);
  const pageSize = 3;

  const handleNext = () => {
    if (cases && current < Math.ceil(cases.length / pageSize)) {
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

  const openCaseModal = (cases: CaseType) => {
    setModalCase(cases);
    setIsModalOpen(true);
  };

  let currentPageCases;

  if (cases) {
    currentPageCases = cases.slice(
      (current - 1) * pageSize,
      current * pageSize
    );
  }

  const DisplayCaseSection = ({ selectedCase }: { selectedCase: ICase }) => {
    let displaySectionTitle = "";
    let displaySectionText = "";

    if (selectedCase.judgment && selectedCase.judgment.trim() !== "") {
      displaySectionTitle = "Judgment: ";
      displaySectionText = selectedCase.judgment;
    } else if (selectedCase.facts && selectedCase.facts.trim() !== "") {
      displaySectionTitle = "Facts: ";
      displaySectionText = selectedCase.facts;
    } else if (selectedCase.reasoning && selectedCase.facts.trim() !== "") {
      displaySectionTitle = "Reasoning: ";
      displaySectionText = selectedCase.reasoning;
    } else if (selectedCase.headnotes && selectedCase.headnotes.trim() !== "") {
      displaySectionTitle = "Headnotes: ";
      displaySectionText = selectedCase.headnotes;
    }
    return (
      <>
        <div className="line-clamp-3">
          <span className="font-bold w-24">{displaySectionTitle}</span>
          {displaySectionText}
        </div>
      </>
    );
  };

  return (
    <>
      {cases && (
        <div className=" p-4">
          <div className="font-semibold">Recommended Cases</div>
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
                {currentPageCases?.map((cases) => (
                  <Col
                    key={cases.id}
                    span={8}
                    className={` ${animate ? animate : ""}`}
                  >
                    <Card
                      title={`Case Number: ${cases.number}`}
                      extra={
                        <Button onClick={() => openCaseModal(cases)}>
                          More
                        </Button>
                      }
                      className="h-48 drop-shadow-md"
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
            <Button
              onClick={handleNext}
              className="mt-16 ml-2"
              disabled={current === Math.ceil(cases.length / pageSize)}
              icon={<CaretRightOutlined />}
              type="text"
            ></Button>
          </div>
        </div>
      )}
      <CaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cases={modalCase}
      />
    </>
  );
};

export default Case;
