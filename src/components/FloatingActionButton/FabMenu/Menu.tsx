import { useState } from "react";
import Select from "react-select";
import "./MenuStyles.css";

const options = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-32k", label: "GPT-4-32k" },
  { value: "gpt-35-turbo", label: "Chat-GPT" },
  { value: "gpt-35-turbo-16k", label: "Chat-GPT-Large" },
];

export function Menu() {
  const [selectedModels, updateSelectedModels] = useState<string[] | []>([]);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({ "1": false, "2": false });

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

  const toggleAccordion = (index: string) => {
    setIsOpen({ ...isOpen, [index]: !isOpen[index] });
  };

  return (
    <nav className="menu">
        <div className="menu-div">
          <div>
            <button className="accordion-header" onClick={() => toggleAccordion("1")}>Chat with Single Chatbot</button>
            {isOpen["1"] && (
              <div className="accordion-panel">
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
              </div>
            )}
            <button className="accordion-header" onClick={() => toggleAccordion("2")}>Chat with Multiple Chatbots</button>
            {isOpen["2"] && (
              <div className="accordion-panel">
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
                      {selectedModels.length === 2 && (
                        <button
                          onClick={handleClick}
                          className="model-select-btn"
                        >
                          Chat
                        </button>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
    </nav>
  );
}

