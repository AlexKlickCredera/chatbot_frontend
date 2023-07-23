import "./MenuStyles.css";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Button,
  DropdownProps,
} from "@fluentui/react-components";
import Select from "react-select";
import { useState } from "react";

export function Menu(props: Partial<DropdownProps>) {
  const options = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-4-32k", label: "GPT-4-32k" },
    { value: "gpt-35-turbo", label: "Chat-GPT" },
    { value: "gpt-35-turbo-16k", label: "Chat-GPT-Large" },
  ];
  const [selectedModels, updateSelectedModels] = useState<string[] | []>([]);

  const updateModelSelection = (selectedOptions: any, actionMeta: any) => {
    if (selectedOptions) {
      const selectedValues = selectedOptions.map((option: any) => option.value);
      updateSelectedModels(selectedValues);
    } else {
      updateSelectedModels([]);
    }
  };
  const handleClick = () => {
    window.location.href = `/many_chats/${selectedModels[0]}&${selectedModels[1]}`;
  };
  return (
    <nav className="menu">
        <div className="menu-div">
          <Accordion>
            <AccordionItem value="1">
              <AccordionHeader
                className="accordion-header"
                expandIconPosition="end"
              >
                Chat with Single Chatbot
              </AccordionHeader>
              <AccordionPanel className="accordion-panel">
                <div className="accordion-item">
                  <ul>
                    <li className="nav-li">
                      <a href="/chat/gpt-35-turbo">Chat-GPT (8k)</a>
                    </li>
                    <li className="nav-li">
                      <a href="/chat/gpt-35-turbo-16k">Chat-GPT-Large (16k)</a>
                    </li>
                    <li className="nav-li">
                      <a href="/chat/gpt-4">GPT-4</a>
                    </li>
                    <li className="nav-li">
                      <a href="/chat/gpt-4-32k">GPT-4-32k</a>
                    </li>
                  </ul>
                </div>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionHeader
                className="accordion-header"
                expandIconPosition="end"
              >
                Chat with Multiple Chatbots
              </AccordionHeader>
              <AccordionPanel className="accordion-panel">
                <div className="accordion-item">
                  <ul style={{ width: "100%", height: "24px" }}>
                    <li>
                      <span className="model-label-2">
                        Select 2 models to compare:
                      </span>
                      <Select
                        defaultMenuIsOpen={true}
                        onChange={updateModelSelection}
                        isMulti
                        name="colors"
                        options={options}
                        className="model-multi-select"
                        classNamePrefix="select"
                      />
                      {selectedModels.length === 2 ? (
                        <Button
                          onClick={handleClick}
                          className="model-select-btn"
                        >
                          Chat
                        </Button>
                      ) : null}
                    </li>
                  </ul>
                </div>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>
    </nav>
  );
}
