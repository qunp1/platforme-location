import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const executablePath = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
export default defineConfig({
  testDir: './e2e', timeout: 45000, fullyParallel: false, workers: 1,
  reporter: [['list'],['json',{outputFile:'replica/test-results.json'}]],
  outputDir: 'test-results',
  use: {baseURL:process.env.NADORLY_URL || 'http://127.0.0.1:5173',headless:true,launchOptions:{...(executablePath ? {executablePath} : {})},screenshot:'only-on-failure'},
  projects:[{name:'desktop',use:{viewport:{width:1440,height:900}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}],
});
