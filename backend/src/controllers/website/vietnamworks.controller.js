import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { sendProgressToClients } from "../scraper.controller.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../../generated/prisma/client');
const prisma = new PrismaClient();

puppeteer.use(StealthPlugin());

export const scaperVietnamWorksController = async (cancelSignal) => {
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({ headless: true })
        page = await browser.newPage();

        sendProgressToClients("Launch 🌐Browser...");

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        );

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        await page.goto('https://www.vietnamworks.com/danh-sach-cong-ty', {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        sendProgressToClients("Opening VIETNAMWORKS...");

        await page.waitForSelector('.view_job_item', { timeout: 30000 });

        let currentCompanies = [];
        let newCompanies = []

        while (true) {
            if (cancelSignal?.aborted) {
                break;
            }

            currentCompanies.push(...newCompanies);

            const companiesLinks = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.view_job_item>.sc-djVXDX.jzLWbA>div>a'));

                return links.map(a => a.href);
            });

            newCompanies.push(...companiesLinks);

            newCompanies = newCompanies.filter(comp => !currentCompanies.includes(comp));

            console.log(currentCompanies.length, " | ", newCompanies.length);


            const companies = [];
            let count = 0;

            for (const link of newCompanies) {
                if (cancelSignal?.aborted) {
                    console.log("Stopped!");
                    sendProgressToClients("❌ Scraping stopped!");
                    break;
                }
                ++count;

                sendProgressToClients(`Fetching company (${count}/${companiesLinks.length}): ${link}`)
                const data = await getCompanyDetails(browser, link, cancelSignal);
                companies.push(data);
                await delay(2000);
            }

            // await page.waitForSelector('div.sc-219887f4-4.bTrbAg>button', { timeout: 30000 });
            await delay(2500);

            const isHidden = await page.evaluate(() => {
                const div = document.querySelector('#vnwLayout__col > div.sc-219887f4-4.bTrbAg')?.outerHTML;
                document.querySelector('#vnwLayout__col > div.sc-219887f4-4.bTrbAg > button.sc-fqkvVR.BsUMj.btn-default.btn-md.clickable').click();
                return div;
            });

            if (isHidden?.includes("display: none;")) {
                console.log('No more content');
                break;
            }
        }
    } catch (err) {
        console.error('Scraping failed:', err);
        next(err);
    } finally {
        sendProgressToClients("_______________________________________")
        await browser?.close();
    }
};

const getCompanyDetails = async (browser, link, cancelSignal) => {
    let page;
    try {
        page = await browser.newPage();

        await page.goto(link, {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        const test = await page.waitForSelector('section.cp_basic_info', { timeout: 30000 });

        const details = await page.evaluate(() => {
            const logo = document.querySelector('section.cp_basic_info>.container>div.row>.cp_logo>div>img')?.src;

            const company_name = document.querySelector('h1#cp_company_name')
                ?.innerText.trim();

            const description = document.querySelector('.cp_story_item_content>.custom-story-item-content')?.innerText;

            let address = document.querySelector("div.cp_address-container");
            const h3 = address?.querySelector("h3");
            address.removeChild(h3);
            address = address?.innerText;

            const website = document.querySelector('a.website-company')?.href;

            const field = document.querySelector('span.li-items-limit')?.innerText.trim();

            return {
                logo,
                address,
                company_name,
                description,
                website,
                field
            }
        });

        const company = await saveCompanyToDataBase(details, link);

        const jobs_list = await getJobsByCompany(page);

        if (jobs_list.length > 0) {
            await getJobDetails(jobs_list, browser, company.id, cancelSignal);
        }

        return details;
    } catch (error) {
        console.log(error);
    } finally {
        await page?.close();
    }
}

const saveCompanyToDataBase = async ({ logo, address, company_name, description, website, field }, link) => {
    try {
        const existingCompany = await prisma.companies.findUnique({
            where: {
                company_name
            }
        });

        let company;

        if (!existingCompany) {
            company = await prisma.companies.create({
                data: {
                    company_name,
                    address,
                    description,
                    imageUrl: logo,
                    sourceUrl: link,
                    source_name: 'VIETNAMWORKS',
                    website,
                    field
                }
            });

            sendProgressToClients(`✅(SAVED) ${company.company_name} successfully!`);
        } else {
            company = existingCompany;
        }

        return company;
    } catch (error) {
        console.log(error);
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getJobsByCompany = async (companyDetailsPage) => {
    try {
        const jobs_list = await companyDetailsPage.evaluate(() => {
            const jobs = Array.from(document.querySelectorAll('.sc-dHrNzZ.fOxDjD>.sc-jXUnUj.jXLNAR>a'));
            return jobs.map(a => a.href);
        })

        return jobs_list;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const getJobDetails = async (jobs_list, browser, company_id, cancelSignal) => {
    let page;
    let count = 0;
    try {
        for (const job of jobs_list) {
            if (cancelSignal?.aborted) {
                console.log("Stopped!");
                sendProgressToClients("❌ Scraping stopped!");
                // browser?.close();
                break;
            }

            console.log(++count, '/', jobs_list.length, " ", company_id);

            page = await browser.newPage();

            await page.goto(job, {
                waitUntil: 'networkidle2',
                timeout: 80000
            });

            await page.waitForSelector('div#vnwLayout__col>.sc-d7132840-1.jZOjiN', { timeout: 30000 });

            await delay(2000);

            await page.click('.sc-b8164b97-0.iwgtdf>.sc-8868b866-0.gTeVIt>button.sc-bd699a4b-0.eOtpMH.btn-highlight.btn-md.clickable');

            const job_details = await page.evaluate(() => {
                const title = document.querySelector('.sc-b8164b97-0.kqEnSA>.sc-8868b866-0.dvidDw>h1.sc-ab270149-0.hAejeW')?.innerText.trim();
                const salary = document.querySelector('.sc-b8164b97-0.djNogb>.sc-8868b866-0.lmzgIo>span.sc-ab270149-0.cVbwLK')?.innerText.trim();

                const apply_location = document.querySelector('.sc-a137b890-1.joxJgK>p.sc-ab270149-0.cLLblL')?.innerText.trim();

                const tags = Array.from(document.querySelectorAll('#vnwLayout__col > div > div > a > button'))
                    ?.map(tag => tag?.innerText.trim())
                    .join(', ');

                let description = document.querySelector('#vnwLayout__col > div > div.sc-1671001a-0.bbOaea > div > div')?.innerText;

                let endDate = document.querySelector('.sc-2557ebc-1.iwszkh>span.sc-ab270149-0.ePOHWr')?.innerText.trim();


                const general_info = document.querySelectorAll('#vnwLayout__col > div > div.sc-7bf5461f-2.JtIju > p');
                const job_level = general_info[1]?.innerText.trim();
                const experience = general_info[6]?.innerText.trim();
                const education = general_info[8]?.innerText.trim();
                const quantity = general_info[12]?.innerText.trim();
                const form_of_work = general_info[13]?.innerText.trim();

                return {
                    title,
                    salary,
                    apply_location,
                    experience,
                    tags,
                    description,
                    endDate,
                    job_level,
                    education,
                    quantity,
                    form_of_work
                }
            });

            await saveJobToDatabase(job_details, job, company_id)

            await page.close();

            await delay(1000);
        }
    } catch (error) {
        console.log(error);
    }
}

const saveJobToDatabase = async ({ title, salary, apply_location, experience, tags, description, endDate, job_level, education, quantity, form_of_work }, source_url, company_id) => {
    try {
        const isExisted = await prisma.jobs.findFirst({
            where: {
                title,
                company_id
            }
        });

        if (!isExisted) {
            const convertedEndDate = formatEndDate(endDate);

            const isQuantityVailable = quantity.match(/\d+/);
            const convertedQuantity = isQuantityVailable ? parseInt(isQuantityVailable[0], 10) : 0;

            const response = await prisma.jobs.create({
                data: {
                    company_id: company_id,
                    title,
                    salary,
                    description,
                    endDate: convertedEndDate,
                    apply_location,
                    experience,
                    form_of_work,
                    job_level,
                    education,
                    tags,
                    quantity: convertedQuantity,
                    sourceUrl: source_url
                }
            });

            // console.log(response);

            if (response) {
                sendProgressToClients(`✅(SAVED) ${title} saved successfully!`);
            }

        }

    } catch (error) {
        console.log(error);
    }
}

const formatEndDate = (endDateStr) => {
    const match = endDateStr.match(/\d+/);
    const endType = endDateStr.trim().split(' ').pop(); // 'ngày' hoặc 'tháng'
    const endValue = match ? parseInt(match[0], 10) : null;

    if (!endValue || (endType !== "ngày" && endType !== "tháng")) {
        return null;
    }

    const currentDate = new Date();
    const newDate = new Date(currentDate); // tạo bản sao để không thay đổi currentDate

    if (endType === "ngày") {
        newDate.setDate(newDate.getDate() + endValue);
    } else if (endType === "tháng") {
        newDate.setMonth(newDate.getMonth() + endValue);
    }

    // Format lại thành yyyy-mm-dd
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // +1 vì getMonth() từ 0-11
    const day = String(newDate.getDate()).padStart(2, '0');

    return new Date(`${year}-${month}-${day}`);
};
