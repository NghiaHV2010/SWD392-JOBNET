import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { sendProgressToClients } from "../scraper.controller.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../../generated/prisma/client');
const prisma = new PrismaClient();

puppeteer.use(StealthPlugin());

export const scaperTOPCVController = async (cancelSignal) => {
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

        await page.goto('https://www.topcv.vn/cong-ty', {
            waitUntil: 'load',
            timeout: 80000
        });

        sendProgressToClients("Opening TopCV...")

        const companiesLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('div.box-company>.company-banner>a'));
            return links.map(a => a.href);
        });

        const companies = [];
        let count = 0;

        for (const link of companiesLinks) {
            if (cancelSignal?.aborted) {
                console.log("Stopped!");
                sendProgressToClients("❌ Scraping stopped!");
                break;
            }
            console.log(++count, '/', companiesLinks.length);

            sendProgressToClients(`Fetching company (${count++}/${companiesLinks.length}): ${link}`)
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

        const test = await page.waitForSelector('h1.company-detail-name', { timeout: 30000 });

        const details = await page.evaluate(() => {
            const logo = document.querySelector('.company-image-logo>img')?.src;

            const company_name = document.querySelector('h1.company-detail-name')
                ?.innerText.trim();

            const description = Array.from(document.getElementById('section-introduce')
                ?.querySelectorAll('.content>p'))
                ?.map(p => p?.innerText.trim())
                .join('\n');

            const address = document.getElementById("section-contact")
                ?.querySelector('.box-body')
                ?.querySelector('.desc')
                ?.innerText.trim();

            const website = document.querySelector('.company-subdetail>.website>a')?.href;

            return {
                logo,
                address,
                company_name,
                description,
                website,
            }
        });

        const company = await saveCompanyToDataBase(details, link);

        const jobs_list = await getJobsByCompany(page, browser);

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

const saveCompanyToDataBase = async ({ logo, address, company_name, description, website }, link) => {
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

const getJobsByCompany = async (companyDetailsPage, browser) => {
    let jobs_list = [];
    try {
        while (true) {
            await companyDetailsPage.waitForSelector('.job-list-default>.job-item-default>.avatar>a', { timeout: 30000 });
            await delay(2000);

            const jobs = await companyDetailsPage.evaluate(() => {
                const jobs_link = Array.from(document.querySelectorAll('.job-list-default>.job-item-default'))
                    ?.filter(a => a.getAttribute("data-box") === 'BoxRecruitmentInCompany')
                    ?.map(a => a.querySelector('.avatar>a')?.href);
                return jobs_link;
            })

            jobs_list.push(...jobs);

            const isNextDisabled = await companyDetailsPage.evaluate(() => {
                const boolean = document.querySelector('#job-listing-paginate>a.btn-next')?.classList.contains('disabled');
                return boolean;
            })

            if (isNextDisabled) break;

            await delay(1500);

            await companyDetailsPage.click('#job-listing-paginate>a.btn-next');
        }

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

            console.log(++count, '/', jobs_list.length);

            page = await browser.newPage();

            await page.goto(job, {
                waitUntil: 'networkidle2',
                timeout: 80000
            });

            await page.waitForSelector('.job-detail__info--title', { timeout: 30000 });

            await delay(2000);

            if (job === jobs_list[0]) {
                const company_field = await page.evaluate(() => {
                    return document.querySelector('.job-detail__company--information-item.company-field>.company-value')?.innerText.trim();
                });

                await prisma.companies.update({
                    where: {
                        id: company_id
                    },
                    data: {
                        field: company_field
                    }
                });
            }

            const job_details = await page.evaluate(() => {
                const title = document.querySelector('h1.job-detail__info--title')?.innerText.trim();
                const salary = document.querySelector('.job-detail__info--sections')
                    ?.getElementsByClassName('job-detail__info--section-content-value')[0]
                    ?.innerText.trim();

                const apply_location = document.querySelector('.job-detail__info--sections')
                    ?.getElementsByClassName('job-detail__info--section-content-value')[1]
                    ?.innerText.trim();

                const experience = document.getElementById('job-detail-info-experience')
                    ?.querySelector('.job-detail__info--section-content-value')
                    ?.innerText.trim();

                const tags = Array.from(document.querySelectorAll('a.item.search-from-tag.link'))
                    ?.map(tag => tag.innerText.trim())
                    .join(', ');

                const description = Array.from(document.querySelectorAll('.job-description__item--content>p'))
                    ?.map(p => p.innerText.trim())
                    .join('\n');

                const endDate = document.querySelector('.job-detail__info--deadline')?.innerText.trim();


                const general_info = document.querySelectorAll('.box-general-group-info-value');
                const job_level = general_info[0]?.innerText.trim();
                const education = general_info[1]?.innerText.trim();
                const quantity = general_info[2]?.innerText.trim();
                const form_of_work = general_info[3]?.innerText.trim();

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

            // console.log(job_details);
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
                title: title
            }
        });

        if (!isExisted) {
            const rawDate = endDate.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
            const [day, month, year] = rawDate ? rawDate.split('/') : [];
            const convertedEndDate = rawDate ? new Date(`${year}-${month}-${day}`) : null;

            const convertedQuantity = +quantity.split(' ')[0];

            // console.log({ title, quantity, convertedQuantity, endDate, convertedEndDate });

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