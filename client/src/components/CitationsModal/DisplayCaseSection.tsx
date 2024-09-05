import { ICase } from "@/types";
import { useTranslation } from "react-i18next";

const DisplayCaseSection = ({ selectedCase }: { selectedCase: ICase }) => {
  let displaySectionTitle = "";
  let displaySectionText = "";

  const { t } = useTranslation();

  if (selectedCase.judgment && selectedCase.judgment.trim() !== "") {
    displaySectionTitle = `${t("judgement")}:`;
    displaySectionText = selectedCase.judgment;
  } else if (selectedCase.facts && selectedCase.facts.trim() !== "") {
    displaySectionTitle = `${t("facts")}:`;
    displaySectionText = selectedCase.facts;
  } else if (selectedCase.reasoning && selectedCase.facts.trim() !== "") {
    displaySectionTitle = `${t("reasoning")}:`;
    displaySectionText = selectedCase.reasoning;
  } else if (selectedCase.headnotes && selectedCase.headnotes.trim() !== "") {
    displaySectionTitle = `${t("headnotes")}:`;
    displaySectionText = selectedCase.headnotes;
  }
  return (
    <>
      <div className="line-clamp-3">
        <span className="font-bold mr-2">{displaySectionTitle}</span>
        {displaySectionText}
      </div>
    </>
  );
};

export default DisplayCaseSection;
