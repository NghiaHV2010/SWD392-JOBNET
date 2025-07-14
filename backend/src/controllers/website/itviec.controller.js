import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { sendProgressToClients } from "../scraper.controller.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../../generated/prisma/client');
const prisma = new PrismaClient();

puppeteer.use(StealthPlugin());

export const scaperITVIECController = async (cancelSignal) => {
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();

        sendProgressToClients("Launch 🌐Browser...");

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
        );

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });

        await page.goto('https://itviec.com/cong-ty-it-tot-nhat-vietnam', {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        sendProgressToClients("Opening ITVIEC...");

        await page.waitForSelector('body > main > div.flex-grow-1 > div.new-vbit-landing-page.bg-light-grey.min-vh-main > div.icontainer.bg-light-grey.ipt-xl-6.ipb-8', { timeout: 30000 })

        await delay(1000);

        const companiesLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a.text-it-black.h2.imb-4.d-xl-none'))?.map(a => a.href);
            const secondTab = Array.from(document.querySelectorAll('.fw-600.ipy-6.text-nowrap>a'))[1]?.href;
            return { links, secondTab };
        });


        await page.goto(companiesLinks.secondTab, {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        await delay(1000);

        const secondLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a.text-it-black.h2.d-none.imb-2.d-xl-block.text-hover-red'))?.map(a => a.href);
            return links;
        })

        companiesLinks.links.push(...secondLinks);

        const companies = [];
        let count = 0;

        for (const link of companiesLinks.links) {
            if (cancelSignal?.aborted) {
                console.log("Stopped!");
                sendProgressToClients("❌ Scraping stopped!");
                break;
            }

            ++count
            console.log(count, '/', companiesLinks.links.length);

            sendProgressToClients(`Fetching company (${count}/${companiesLinks.links.length}): ${link}`)
            const data = await getCompanyDetails(browser, link, cancelSignal);
            companies.push(data);
            await delay(2000);
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

        const test = await page.waitForSelector('div.flex-grow-1 > main > div.main.bg-gradient-search.text-white.ipt-6.ipb-8.ipy-xl-8', { timeout: 30000 });

        const details = await page.evaluate(() => {
            const logo = document.querySelector('div.flex-grow-1 > main > div.main.bg-gradient-search.text-white.ipt-6.ipb-8.ipy-xl-8 > div > div > div.col-xl-8 > div > div.d-flex.justify-content-center > div > picture > img')
                ?.src;

            const company_name = document.querySelector('div.flex-grow-1 > main > div.main.bg-gradient-search.text-white.ipt-6.ipb-8.ipy-xl-8 > div > div > div.col-xl-8 > div > div.min-width-0 > h1')
                ?.innerText.trim();

            const description = document.querySelector('body > main > div.flex-grow-1 > main > div.bg-light-grey.employer-content.ipt-xl-8.ipt-0 > div > div > div.col-xl-8 > div:nth-child(3) > div.paragraph.ipt-4.text-break.text-contain-hyperlink')
                ?.innerText;

            const address = document.querySelector('body > main > div.flex-grow-1 > main > div.bg-light-grey.employer-content.ipt-xl-8.ipt-0 > div > div > div.col-xl-8 > div:nth-child(6) > div > div > div.col-xl-4.locations.i-scrollbar > div.location.box-shadow-normal.border-radius-normal.cursor-pointer.ip-3.imb-3.active > div > span.text-break')
                ?.innerText

            const website = document.querySelector('body > main > div.flex-grow-1 > main > div.bg-light-grey.employer-content.ipt-xl-8.ipt-0 > div > div > div.col-xl-8 > div:nth-child(3) > div.d-flex.flex-column.flex-xl-row.paragraph.border-top-dashed.imt-4 > div.d-flex.align-items-center.cursor-pointer.ipt-4.ipe-4')
                ?.getAttribute('data-redirect-url-url-value');

            const field = document.querySelector('body > main > div.flex-grow-1 > main > div.bg-light-grey.employer-content.ipt-xl-8.ipt-0 > div > div > div.col-xl-8 > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div.text-end.text-xl-start > div')
                ?.innerText.trim();

            return {
                logo,
                address,
                company_name,
                description,
                website,
                field
            }
        });

        // console.log(details);


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
                    source_name: 'ITVIEC',
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
        await companyDetailsPage.waitForSelector('.job-card', { timeout: 30000 });
        await delay(2000);

        const jobs = await companyDetailsPage.evaluate(() => {
            const jobs_link = Array.from(document.querySelectorAll('.job-card>div>h3>a'))?.map(a => a?.href);
            return jobs_link;
        });

        return jobs;
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

            await page.waitForSelector('.job-show-header', { timeout: 30000 });

            await delay(2000);

            const job_details = await page.evaluate(() => {
                const title = document.querySelector('.job-header-info>h1')?.innerText.trim();
                // const salary = document.querySelector('.job-detail__info--sections')
                //     ?.getElementsByClassName('job-detail__info--section-content-value')[0]
                //     ?.innerText.trim();

                const apply_location = document.querySelector('body > main > div.flex-grow-1 > div.jd-main.position-relative > div.icontainer > div.row.im-0.ip-0 > div.col-xl-8.im-0.ip-0 > div.ipy-3.ipx-5.bg-it-white.text-rich-grey.job-show-info.box-shadow-medium > div > div.d-flex.flex-column.gap-2 > div:nth-child(1) > span')
                    ?.innerText.trim();

                let h2;

                let experience = document.querySelector('body > main > div.flex-grow-1 > div.jd-main.position-relative > div.icontainer > div.row.im-0.ip-0 > div.col-xl-8.im-0.ip-0 > section > div:nth-child(5)');
                h2 = experience.querySelector('h2');
                experience.removeChild(h2);
                experience = experience?.innerText;

                const tags = Array.from(document.querySelectorAll('body > main > div.flex-grow-1 > div.jd-main.position-relative > div.icontainer > div.row.im-0.ip-0 > div.col-xl-8.im-0.ip-0 > div.ipy-3.ipx-5.bg-it-white.text-rich-grey.job-show-info.box-shadow-medium > div > div:nth-child(3) > div.d-flex.flex-wrap.igap-2 > a'))
                    ?.map(tag => tag.innerText.trim())
                    .join(', ');

                let description = document.querySelector('body > main > div.flex-grow-1 > div.jd-main.position-relative > div.icontainer > div.row.im-0.ip-0 > div.col-xl-8.im-0.ip-0 > section > div:nth-child(3)')
                h2 = description.querySelector('h2');
                description.removeChild(h2);
                description = description?.innerText;

                // const endDate = document.querySelector('.job-detail__info--deadline')?.innerText.trim();


                // const general_info = document.querySelectorAll('.box-general-group-info-value');
                // const job_level = general_info[0]?.innerText.trim();
                // const education = general_info[1]?.innerText.trim();
                // const quantity = general_info[2]?.innerText.trim();
                const form_of_work = document.querySelector('body > main > div.flex-grow-1 > div.jd-main.position-relative > div.icontainer > div.row.im-0.ip-0 > div.col-xl-4.im-0.ip-0.ips-xl-6 > section > div:nth-child(3) > div:nth-child(5) > div.col.text-end.text-it-black')
                    ?.innerText;

                return {
                    title,
                    // salary,
                    apply_location,
                    experience,
                    tags,
                    description,
                    // endDate,
                    // job_level,
                    // education,
                    // quantity,
                    form_of_work
                }
            });

            // console.log(job_details);
            await saveJobToDatabase(job_details, job, company_id)

            await page.close();

            await delay(1000);
        }
    } catch (error) {
        console.log(error);
    }
}

const saveJobToDatabase = async ({ title, apply_location, experience, tags, description, form_of_work }, source_url, company_id) => {
    try {
        const isExisted = await prisma.jobs.findFirst({
            where: {
                title,
                company_id
            }
        });

        if (!isExisted) {
            // const rawDate = endDate.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
            // const [day, month, year] = rawDate ? rawDate.split('/') : [];
            // const convertedEndDate = rawDate ? new Date(`${year}-${month}-${day}`) : null;

            // const convertedQuantity = +quantity.split(' ')[0];

            // console.log({ title, quantity, convertedQuantity, endDate, convertedEndDate });

            const response = await prisma.jobs.create({
                data: {
                    company_id: company_id,
                    title,
                    description,
                    apply_location,
                    experience,
                    form_of_work,
                    tags,
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