import "cally";
import "../styles/scraperPage.css";
import LogoCarousel from "../components/LogoCarousel";
import { useState, useEffect } from "react";
import { websites } from "../constants/website.js";
import { axiosConfig } from "../config/axios.config.js";
import { Loader } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import Countdown from "../components/Countdown.jsx";

gsap.registerPlugin(SplitText);

const ScraperPage = () => {
  const [repeat, setRepeat] = useState(true);
  const [checkedRandomSites, setCheckedRandomSites] = useState(false);
  const [repeatTime, setRepeatTime] = useState({
    value: 30,
    type: 1000,
  });
  const [initialRepeat, setInitialRepeat] = useState(false);

  const [schedule, setSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState({
    hour: "00",
    minute: "00",
    second: "00",
  });

  const [logMessage, setLogMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(websites[1]);

  const bottomRef = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logMessage]);

  useGSAP(() => {
    let split = SplitText.create(`#split${logMessage.length}`, {
      type: "words, lines",
    });
    gsap.from(split.words, {
      duration: 0.05,
      opacity: 0,
      stagger: 0.15,
    });
  }, [logMessage]);

  const handleSubmit = async () => {
    let base_url = `http://localhost:3000/api/v1/scrape?repeat=${repeat}`;
    let data;

    if (repeat) {
      data = new URLSearchParams({
        random: checkedRandomSites,
        time: repeatTime.value * repeatTime.type,
        source_name: selectedWebsite.name,
      });
    } else {
      data = new URLSearchParams({
        time: `${scheduleDate}T${scheduleTime.hour.padStart(
          2,
          0
        )}:${scheduleTime.minute.padStart(2, 0)}:${scheduleTime.second.padStart(
          2,
          0
        )}`,
        source_name: selectedWebsite.name,
        random: false,
      });
    }
    setIsLoading(true);
    eventSourceRef.current = new EventSource(`${base_url}&${data.toString()}`);

    eventSourceRef.current.onmessage = (event) => {
      setLogMessage((prev) => [...prev, event.data]);
    };

    eventSourceRef.current.addEventListener("done", (event) => {
      console.log(event);
      setInitialRepeat(false);
      setIsLoading(false);
      console.log("✅ Scraping finished:", event.data);
      eventSourceRef.current.close();
    });

    eventSourceRef.current.onerror = (event) => {
      if (eventSourceRef.current.readyState === 2) {
        setInitialRepeat(false);
        setIsLoading(false);
        console.log("🔴 Server đã đóng kết nối");
        eventSourceRef.current.close();
      }
    };
  };

  const handleCancel = () => {
    if (eventSourceRef.current) {
      console.log(eventSourceRef.current);

      eventSourceRef.current.onmessage = (event) => {
        setLogMessage((prev) => [...prev, event.data]);
      };
      eventSourceRef.current.close();
      setInitialRepeat(false);
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen h-full flex flex-col items-center justify-center">
      <div className="">
        <h1 className="text-neutral-800 text-5xl font-bold">
          Powerfull Scraper Tools
        </h1>
        <p className="text-neutral-600 text-center mt-4">
          Scrape any jobs with automation
        </p>
      </div>

      <div className="mockup-browser border-base-300 border w-2/4 mt-12">
        <div className="mockup-browser-toolbar">
          <div className="input !bg-neutral-300 text-neutral-800 !text-lg py-2">
            {selectedWebsite.url}
          </div>
          <div className="flex absolute left-2.5 gap-2">
            <div className="size-6 rounded-full bg-red-500"></div>
            <div className="size-6 rounded-full bg-warning"></div>
            <div className="size-6 rounded-full bg-success"></div>
          </div>
          {isLoading && schedule && (
            <Countdown
              targetTime={`${scheduleDate}T${scheduleTime.hour.padStart(
                2,
                0
              )}:${scheduleTime.minute.padStart(
                2,
                0
              )}:${scheduleTime.second.padStart(2, 0)}`}
            />
          )}
        </div>
        <div className="flex justify-between items-center px-4 pb-4 place-content-center border-t border-base-300 h-100 text-black">
          <div className="bg-neutral-800 size-full mt-4 mr-3 rounded-lg text-white overflow-auto py-6">
            {logMessage.length > 0 ? (
              logMessage?.map((message, index) => (
                <span key={index}>
                  <div
                    className="text-green-500 ml-3 mt-2"
                    id={`split${index + 1}`}
                  >
                    {message}
                  </div>
                  <div className="" ref={bottomRef}></div>
                </span>
              ))
            ) : (
              <></>
            )}
          </div>

          <fieldset className="fieldset bg-neutral-100 border-base-300 rounded-box w-1/4 h-full border p-4 transition-all">
            <legend className="fieldset-legend text-neutral-600 text-lg">
              Settings
            </legend>

            <label className="label text-md mb-3">
              <input
                type="checkbox"
                checked={repeat}
                className="toggle  border-neutral-600 bg-neutral-300 text-neutral-600 checked:border-indigo-600 checked:bg-indigo-500 checked:text-white"
                onChange={(e) => {
                  setRepeat(e.target.checked);
                  setSchedule(repeat);
                }}
              />
              Schedule repeat
            </label>

            {repeat && (
              <>
                <div className="flex items-center justify-around gap-2">
                  <input
                    type="number"
                    maxLength={2}
                    max={59}
                    min={0}
                    value={repeatTime.value}
                    className="input bg-white border-neutral-400"
                    onChange={(e) =>
                      setRepeatTime({ ...repeatTime, value: e.target.value })
                    }
                  />
                  <select
                    defaultValue="Pick a color"
                    className="select border-neutral-400 bg-white"
                    onChange={(e) =>
                      setRepeatTime({ ...repeatTime, type: e.target.value })
                    }
                  >
                    <option value={1000}>Second</option>
                    <option value={60 * 1000}>Minute</option>
                    <option value={60 * 60 * 1000}>Hour</option>
                    <option value={24 * 60 * 60 * 1000}>Day</option>
                  </select>
                </div>
                <div className=" flex gap-x-2 items-center my-2">
                  <input
                    type="checkbox"
                    checked={checkedRandomSites}
                    className="checkbox border-neutral-400 checked:bg-primary"
                    onChange={(e) => setCheckedRandomSites(e.target.checked)}
                  />
                  Random site
                </div>
              </>
            )}

            <label className="label text-md mt-4">
              <input
                type="checkbox"
                checked={schedule}
                className="toggle  border-neutral-600 bg-neutral-300 text-neutral-600 checked:border-indigo-600 checked:bg-indigo-500 checked:text-white"
                onChange={(e) => {
                  setSchedule(e.target.checked);
                  setRepeat(schedule);
                }}
              />
              Schedule specific Date&Time
            </label>

            {schedule && (
              <>
                <button
                  popoverTarget="cally-popover1"
                  className="input bg-white border-neutral-400 mt-2"
                  id="cally1"
                >
                  {scheduleDate || "Pick a date"}
                </button>
                <div
                  popover="auto"
                  id="cally-popover1"
                  className="dropdown bg-white rounded-box shadow-lg "
                >
                  <calendar-date
                    className="cally"
                    onchange={(e) => {
                      setScheduleDate(e.target.value);
                      document.getElementById("cally1").click();
                    }}
                  >
                    <svg
                      aria-label="Previous"
                      className="fill-current size-4 text-black hover:text-white"
                      slot="previous"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                    </svg>
                    <svg
                      aria-label="Next"
                      className="fill-current size-4 text-black hover:text-white"
                      slot="next"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                    </svg>
                    <calendar-month></calendar-month>
                  </calendar-date>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <input
                    type="number"
                    maxLength={2}
                    max={23}
                    min={0}
                    value={scheduleTime.hour}
                    className="input bg-white border-neutral-400"
                    onChange={(e) =>
                      setScheduleTime({
                        ...scheduleTime,
                        hour: `${e.target.value}`,
                      })
                    }
                  />
                  :
                  <input
                    type="number"
                    maxLength={2}
                    max={59}
                    min={0}
                    value={scheduleTime.minute}
                    className="input bg-white border-neutral-400"
                    onChange={(e) =>
                      setScheduleTime({
                        ...scheduleTime,
                        minute: `${e.target.value}`,
                      })
                    }
                  />
                  :
                  <input
                    type="number"
                    maxLength={2}
                    max={59}
                    min={0}
                    value={scheduleTime.second}
                    className="input bg-white border-neutral-400"
                    onChange={(e) =>
                      setScheduleTime({
                        ...scheduleTime,
                        second: `${e.target.value}`,
                      })
                    }
                  />
                </div>
              </>
            )}
          </fieldset>
        </div>
      </div>

      <div className="mb-12 mt-8 flex justify-center items-center gap-3 transition-all">
        <button
          className={`btn btn-wide btn-primary btn-xl disabled:!bg-primary/90`}
          disabled={isLoading}
          onClick={() => handleSubmit()}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner"></span>
              Scraping
            </>
          ) : (
            "Start Scraping"
          )}
        </button>
        {isLoading && (
          <button
            className="btn size-14 bg-red-500 border-none"
            onClick={() => handleCancel()}
          >
            <div className="bg-white size-6 rounded-sm"></div>
          </button>
        )}
      </div>
      <div className="h-36 w-full">
        <LogoCarousel
          selectedWebsite={selectedWebsite}
          setSelectedWebsite={setSelectedWebsite}
        />
      </div>
    </section>
  );
};

export default ScraperPage;
