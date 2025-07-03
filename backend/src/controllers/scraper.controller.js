import cron from 'node-cron';
import { scaperTOPCVController } from './website/topcv.controller.js';
import { scaperVietnamWorksController } from './website/vietnamworks.controller.js';
import { scaperITVIECController } from './website/itviec.controller.js';

let response;

const webistes = ["TOPCV", "VIETNAMWORKS", "ITVIEC"];

export const scheduleScraper = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    response = res;

    const controller = new AbortController();

    const signal = controller.signal;
    const { source_name, time, repeat, random } = req.query;

    let loopCount = 0;
    let intervalID;

    req.on('close', () => {
        if (intervalID) clearInterval(intervalID);
        console.log("Closed connection!");
        controller.abort();
        res.end();
    })

    try {

        if (repeat === 'true') {
            await initialScraper(source_name, signal);

            intervalID = setInterval(async () => {
                let randomWebsite = source_name;
                if (random == 'true') {
                    randomWebsite = webistes[Math.floor(Math.random() * webistes.length)]
                }
                console.log('Interval', randomWebsite);

                sendProgressToClients(`Start loop ${++loopCount}: Scraping ${randomWebsite}`)

                await initialScraper(randomWebsite, signal);
            }, time);

        } else if (req.query.repeat === 'false') {
            const scheduleDate = new Date(time);
            scheduleDate.setHours(scheduleDate.getHours() + 7);

            const job = cron.schedule('* * * * * *', async () => {
                const now = new Date();
                now.setHours(now.getHours() + 7);
                if (signal?.aborted) {
                    job.stop();
                }

                if (
                    now.getFullYear() === scheduleDate.getFullYear() &&
                    now.getMonth() === scheduleDate.getMonth() &&
                    now.getDate() === scheduleDate.getDate() &&
                    now.getHours() === scheduleDate.getHours() &&
                    now.getMinutes() === scheduleDate.getMinutes() &&
                    now.getSeconds() === scheduleDate.getSeconds()
                ) {
                    console.log('👉 Đã đến thời điểm chạy job!', now, ' | ', scheduleDate);

                    await initialScraper(source_name, signal);
                    job.stop();
                    sendProgressToClients(`\nevent: done`);
                    res.end();
                }
            });
        }

    } catch (error) {
        res.end();
    }
}

export const sendProgressToClients = (message) => {
    response.write(`data:${message}\n\n`);
}

const initialScraper = async (website, signal) => {
    switch (website) {
        case "TOPCV":
            await scaperTOPCVController(signal);
            break;
        case "CAREERVIET":

            break;
        case "VIETNAMWORKS":
            await scaperVietnamWorksController(signal);
            break;
        case "CAREERLINK":

            break;
        case "TOPDEV":

            break;
        case "VIECLAM24H":

            break;
        case "ITVIEC":
            await scaperITVIECController(signal);
            break;
    }
}