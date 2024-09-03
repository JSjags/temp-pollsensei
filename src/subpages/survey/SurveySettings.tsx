

interface SurveySettingsProps{
  isSidebarOpen: boolean;
  onClick?: () => void;
}

const SurveySettings:React.FC<SurveySettingsProps> = ({isSidebarOpen, onClick}) => {

  return (
    <div>
            {/* Sidebar for mobile */}
            <div
        className={`inset-y-0 right-0 z-50 bg-white shadow-lg transform h-full flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
      >
        {/* <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-[#5B03B2]">PollSensei</h2>
          </div>
          <button
            onClick={onClick}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div> */}
        <aside className="mt-4">
          <div className="space-y-2">
           Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti eveniet at odio neque dolorem officia doloremque temporibus officiis, dignissimos voluptate accusamus corporis, maxime voluptatibus ad aliquid architecto sequi quibusdam sit.
          </div>
        </aside>
      </div>
    </div>
  )
}

export default SurveySettings
