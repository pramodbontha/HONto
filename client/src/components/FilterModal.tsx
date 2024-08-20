import {
  Drawer,
  DrawerProps,
  Checkbox,
  Form,
  DatePicker,
  Space,
  Button,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;

interface FilterModalProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  isDrawerOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormFinish: (values: any) => void;
}

const FilterModal = (props: FilterModalProps) => {
  const { form, isDrawerOpen, onClose, onFormFinish, onReset } = props;
  const [placement] = useState<DrawerProps["placement"]>("right");
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log(values);
    onFormFinish(values);
    onClose();
  };

  return (
    <>
      <Drawer
        title="Filters"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={isDrawerOpen}
        key={placement}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onFinish={onFinish}
        >
          <div className=" flex justify-end items-end -mb-6">
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t("apply")}
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  {t("reset")}
                </Button>
              </Space>
            </Form.Item>
          </div>
          <div>
            <div className="p-2">
              <div className="text-lg font-bold">Articles</div>
              <div className="text-sm font-semibold p-2">Search in:</div>
              <div className="ml-6">
                <Form.Item
                  className="mb-0"
                  name="articleNumber"
                  valuePropName="checked"
                >
                  <Checkbox>Number</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="articleText"
                  valuePropName="checked"
                >
                  <Checkbox>Text</Checkbox>
                </Form.Item>
              </div>
            </div>

            <div className="p-2">
              <div className="text-lg font-bold">Cases</div>
              <div className="text-sm font-semibold p-2">Search in:</div>
              <div className="ml-6">
                <Form.Item
                  className="mb-0"
                  name="caseName"
                  valuePropName="checked"
                >
                  <Checkbox>Name</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseNumber"
                  valuePropName="checked"
                >
                  <Checkbox>Number</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseHeadnotes"
                  valuePropName="checked"
                >
                  <Checkbox>Headnotes</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseFacts"
                  valuePropName="checked"
                >
                  <Checkbox>Facts</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseJudgement"
                  valuePropName="checked"
                >
                  <Checkbox>Judgement</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseReasoning"
                  valuePropName="checked"
                >
                  <Checkbox>Reasoning</Checkbox>
                </Form.Item>
              </div>
              <div className="text-sm font-semibold p-2">Filter by:</div>
              <div className="ml-6">
                <Form.Item className="mb-1" name="caseYear">
                  <RangePicker picker="year" />
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="caseDecision"
                  valuePropName="checked"
                >
                  <Checkbox>Decision</Checkbox>
                </Form.Item>
              </div>
            </div>
            <div className="p-2">
              <div className="text-lg font-bold">Textbooks</div>
              <div className="text-sm font-semibold p-2">Search in:</div>
              <div className="ml-6">
                <Form.Item
                  className="mb-2"
                  name="tbRefArtCases"
                  valuePropName="checked"
                >
                  <Checkbox>References to articles and cases</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-2"
                  name="tbContextReferences"
                  valuePropName="checked"
                >
                  <Checkbox>Context of the references</Checkbox>
                </Form.Item>
              </div>
              <div className="text-sm font-semibold p-2">Filter by:</div>
              <div className="ml-6">
                <Form.Item className="mb-0" name="GG" valuePropName="checked">
                  <Checkbox>GG</Checkbox>
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  name="BVerfGE"
                  valuePropName="checked"
                >
                  <Checkbox>BVerfGE</Checkbox>
                </Form.Item>
              </div>
            </div>
          </div>
          <div className=" flex justify-end items-end">
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {t("apply")}
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  {t("reset")}
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default FilterModal;
