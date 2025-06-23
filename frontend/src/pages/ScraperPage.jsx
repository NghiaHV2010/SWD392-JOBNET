import React from 'react'
import LogoCarousel from '../components/LogoCarousel';
import "../styles/scraperPage.css";
import { images } from '../constants/images';
import { useState } from 'react';
import { useEffect } from 'react';
import "cally";

const ScraperPage = () => {
    const [repeat, setRepeat] = useState(true);
    const [schedule, setSchedule] = useState(false);
    const [date, setDate] = useState("");

    useEffect(() => {
        console.log(date);

    }, [date])

    return (
        <section className='w-full min-h-screen h-full flex flex-col items-center justify-center'>
            <div className="">
                <h1 className="text-neutral-800 text-5xl font-bold">Powerfull Scraper Tools</h1>
                <p className="text-neutral-600 text-center mt-4">Scrape any jobs with automation</p>
            </div>

            <div className="mockup-browser border-base-300 border w-2/4 mt-12">
                <div className="mockup-browser-toolbar">
                    <div className="input !bg-neutral-300 text-neutral-800 !text-lg py-2">
                        https://daisyui.com
                    </div>
                    <div className='flex absolute left-2.5 gap-2'>
                        <div className="size-6 rounded-full bg-red-500"></div>
                        <div className="size-6 rounded-full bg-warning"></div>
                        <div className="size-6 rounded-full bg-success"></div>
                    </div>
                </div>
                <div className="flex justify-between items-center px-4 pb-4 place-content-center border-t border-base-300 h-100 text-black">
                    Hello!
                    <fieldset className="fieldset bg-neutral-100 border-base-300 rounded-box w-1/4 h-full border p-4 transition-all">
                        <legend className="fieldset-legend text-neutral-600 text-lg">Settings</legend>
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

                        {
                            repeat &&
                            <>
                                <div className="flex items-center justify-around gap-2">
                                    <input type='number' defaultValue={30} className='input bg-white border-neutral-400' />
                                    <select defaultValue="Pick a color" className="select border-neutral-400 bg-white">
                                        <option>Second</option>
                                        <option selected>Minute</option>
                                        <option>Hour</option>
                                        <option>Day</option>
                                    </select>
                                </div>
                                <div className=" flex gap-x-2 items-center my-2">
                                    <input type="checkbox" className="checkbox border-neutral-400 checked:bg-primary" />
                                    Random site
                                </div>
                            </>
                        }

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

                        {
                            schedule &&
                            <>
                                <button popoverTarget="cally-popover1" className="input bg-white border-neutral-400 " id="cally1">
                                    {date ? date : "Pick a date"}
                                </button>
                                <div popover="manual"  id="cally-popover1" className="dropdown bg-white rounded-box shadow-lg">
                                    <calendar-date class="cally" onchange={(e) => {
                                        console.log(e.target.value);
                                        
                                        setDate(e.target.value);
                                    }}>
                                        <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                        <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                        <calendar-month></calendar-month>
                                    </calendar-date>
                                </div>
                            </>
                        }
                    </fieldset>
                </div>
            </div>

            <div className="mb-12 mt-8 flex justify-center items-center gap-4">
                <button className="btn btn-wide btn-primary btn-xl">Start Scraping</button>
                <button className="btn btn-square p-7 btn-outline btn-primary hover:bg-base-content">
                    <div className="text-3xl">📆</div>
                </button>
            </div>
            <div className="h-36 w-full">
                <LogoCarousel />
            </div>
        </section>
    )
}

export default ScraperPage