import { truncate, appendFile, sleep, dataDir } from '../src/utils';
import { test } from '@playwright/test';
import { NodeHtmlMarkdown } from 'node-html-markdown';

test('scrape-terra_k8s', async ({ page }) => {
  const baseUrl = 'https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs';
  const linksFile = `${dataDir}/terraform_k8s-links.txt`;
  const markdownFile = `${dataDir}/terraform_k8s-content.md`;

  const nhm = new NodeHtmlMarkdown();
  const unvisitedLinks = new Set([baseUrl]);
  const visitedLinks = new Set();

  async function scrapeLeftMenu() {
    await page.goto(baseUrl);
    await page.waitForSelector('ul.menu-list.provider-docs-menu-list');

    await page.evaluateHandle(() => {
      const menu = document.querySelector('ul.menu-list.provider-docs-menu-list');
      const items = Array.from(menu?.querySelectorAll('&>div a') || []) as HTMLAnchorElement[];
      items.forEach(item => item.click());
    })

    const items = await page.evaluateHandle(() => {
      const menu = document.querySelector('ul.menu-list.provider-docs-menu-list');
      return Array.from(menu?.querySelectorAll("a[href]") || [])
        .map((a) => (a as HTMLAnchorElement).href);
    })

    const links = await items.jsonValue()
    links.forEach(link => unvisitedLinks.add(link));
  }

  async function scrapeLinks(url: string) {
    url = url.split('#')[0]; // Remove the hash part
    url = url.split('?')[0]; // Remove the query part
    url = url.replace(/\/$/, ''); // Remove trailing slash

    if (visitedLinks.has(url)) {
      return;
    }

    // Mark the URL as visited
    visitedLinks.add(url);
    await appendFile(linksFile, `${url}\n`);

    await page.goto(url);
    await sleep(2000);
    const links = await page.$$eval(`a[href^="${baseUrl}"]`, (anchors: HTMLAnchorElement[]) => {
      return anchors.map(anchor => anchor.href);
    });

    // Handle links
    const filteredLinks = links.filter(link => !visitedLinks.has(link));
    console.log(`Found ${filteredLinks.length} on ${url}`);
    filteredLinks.forEach(link => unvisitedLinks.add(link));

    // Convert page content to Markdown and append to file
    const content = await page.content();
    const markdownContent = nhm.translate(content);
    await appendFile(markdownFile, markdownContent);
  }

  await truncate(linksFile);
  await truncate(markdownFile);

  await scrapeLeftMenu();
  while (unvisitedLinks.size > 0) {
    const link = unvisitedLinks.values().next().value;
    unvisitedLinks.delete(link);
    await scrapeLinks(link);
  }
});
