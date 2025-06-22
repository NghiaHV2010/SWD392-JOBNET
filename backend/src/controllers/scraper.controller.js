import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cron from 'node-cron';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

puppeteer.use(StealthPlugin());
let company_count = 0;
let job_count = 0;

export const scheduleScraper = () => {
    setTimeout(() => {console.log("HEllo")}, 5000)

    cron.schedule('*/1 * * * *', async () => {
        console.log(`🚀 Đang bắt đầu cào dữ liệu lúc: ${new Date().toLocaleString()}`);
        try {
            // await scaperController(); // đảm bảo hàm này không cần `req`, `res`
            console.log("test dat lich 1p");

            console.log(`✅ Cào dữ liệu thành công lúc: ${new Date().toLocaleString()}`);
        } catch (err) {
            console.error(`❌ Lỗi khi cào dữ liệu:`, err.message);
        }
    });
}

export const scaperController = async (req, res, next) => {
    let browser;
    let page;

    try {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();

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

        const companiesLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('div.box-company>.company-banner>a'));
            return links.map(a => a.href);
        });

        const companies = [];

        for (const link of companiesLinks) {
            const data = await getCompanyDetails(browser, link);
            companies.push(data);
            company_count = company_count++;
            await delay(2000);
        }

        console.log("Total companies:", company_count, " | Total jobs: ", job_count);
        res.status(200).json({
            data: companies
        })

    } catch (err) {
        console.error('Scraping failed:', err);
        next(err);
    } finally {
        await browser?.close();
    }
};

const getCompanyDetails = async (browser, link) => {
    let page;
    try {
        page = await browser.newPage();

        await page.goto(link, {
            waitUntil: 'networkidle2',
            timeout: 80000
        });

        const test = await page.waitForSelector('h1.company-detail-name', { timeout: 30000 });
        console.log("test", test);


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
            await getJobDetails(jobs_list, browser, company.id);
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
        const date = new Date();

        const company = await prisma.companies.upsert({
            where: {
                company_name: company_name
            },
            update: {
                address: address,
                description: description,
                imageUrl: logo,
                sourceUrl: link,
                source_name: 'TOPCV',
                website: website
            },
            create: {
                company_name: company_name,
                address: address,
                description: description,
                imageUrl: logo,
                sourceUrl: link,
                source_name: 'TOPCV',
                website: website
            }
        });

        console.log(`✅(UPSERTED) ${company.company_name} at ${date}`);
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

const getJobDetails = async (jobs_list, browser, company_id) => {
    let page;
    try {
        for (const job of jobs_list) {
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

            await delay(1000);
            page?.close();
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
                job_count = job_count++;
                const date = new Date();
                console.log(`>>> ✅(SAVED) ${company_id} / ${title} saved successfully: ${date}`);

            }

        }

    } catch (error) {
        console.log(error);
    }
}