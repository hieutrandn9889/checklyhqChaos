import { randomStringNumber, getCurrentDateDDMMYYYY } from './globalFunc'
import { expect, Page } from '@playwright/test'

export const goToUrl = async (url: string, page: Page) => {
  await page.goto(url)
}

export const clickLocatorElementId = async (element: string, page: Page) => {
  await page.locator(element).waitFor()
  await page.locator(element).click()
}

export const doubleClickLocatorElementId = async (element: string, page: Page) => {
  await page.locator(element).waitFor()
  await page.locator(element).dblclick()
}

export const clickGetByLabel = async (element: string, page: Page) => {
  await page.getByLabel(element).waitFor()
  await page.getByLabel(element).click()
}

export const fillLocatorElementId = async (element: string, page: Page, value: string) => {
  await page.locator(element).waitFor()
  await page.locator(element).fill(value)
  await page.waitForTimeout(1000)
}

export const fillLocatorRanDomNumberElementId = async (element: string, page: Page, value: string) => {
  await page.locator(element).waitFor()
  await page.locator(element).fill(`${value}${randomStringNumber()}`)
  await page.waitForTimeout(1000)
}

export const editElementId = async (element: string, page: Page, value: string) => {
  await page.locator(element).waitFor()
  await page.locator(element).click()
  await page.waitForTimeout(1000)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.locator(element).fill(value)
  await page.waitForTimeout(1000)
}

export const clearElementInput = async (element: string, page: Page) => {
  await page.locator(element).waitFor()
  await page.locator(element).click()
  await page.waitForTimeout(1000)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.waitForTimeout(1000)
}

export const waitForNavigationPage = async (page: Page) => {
  await page.waitForNavigation()
}

export const verifyToBeVisible = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(page.locator(element)).toBeVisible()
}

export const verifyNotVisible = async (element: string, page: Page) => {
  await page.waitForTimeout(2000)
  await expect(page.locator(element)).not.toBeVisible()
}

export const verifyToBeEnabled = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(page.locator(element)).toBeEnabled()
}

export const verifyToBeDisabled = async (element: string, page: Page) => {
  await page.waitForTimeout(2000)
  await expect(page.locator(element)).toBeDisabled()
}

export const verifyNotDisabled = async (element: string, page: Page) => {
  await page.waitForTimeout(2000)
  await expect(page.locator(element)).not.toBeDisabled()
}

export const verifyToHaveText = async (element: string, page: Page, value: string) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(page.locator(element)).toHaveText(value)
}

export const uploadFileData = async (element: string, page: Page, value: string) => {
  const path = require('path')
  const fileToUpload = '/dataTest/' + value
  const absolutePath = path.resolve(process.cwd() + fileToUpload)
  await page.locator(element).setInputFiles(absolutePath)
  await page.waitForTimeout(5000)
}

export const getText = async (element: string, page: Page) => {
  await page.textContent(element)
}

export const getInputValue = async (element: string, page: Page) => {
  await page.inputValue(element)
}

export const verifyGetTextToContain = async (element: string, page: Page, value: string) => {
  await page.waitForTimeout(5000)
  await page.locator(element).waitFor()
  await expect(await page.textContent(element)).toContain(value)
}

export const verifyGetInputValueToContain = async (element: string, page: Page, value: string) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(await page.inputValue(element)).toContain(value)
}

export const verifyChecked = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(await page.locator(element).isChecked()).toBeTruthy()
}

export const verifyCheckDDMMYYYY = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await expect(await page.inputValue(element)).toEqual(getCurrentDateDDMMYYYY())
  // await expect(await getInputValue(element, page)).toEqual(getCurrentDateDDMMYYYY())
}

export const arrowDownEnterKeyBoard = async (page: Page) => {
  await page.waitForTimeout(5000)
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
}

export const enterKeyBoard = async (page: Page) => {
  await page.waitForTimeout(3000)
  await page.keyboard.press('Enter')
}

export const deleteKeyBoardMac = async (page: Page) => {
  await page.waitForTimeout(1000)
  await page.keyboard.press('Meta+A')
  await page.keyboard.press('Delete')
}

export const deleteKeyBoardWinLinux = async (page: Page) => {
  await page.waitForTimeout(1000)
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
}

export const hoverLocatorElementId = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  await page.locator(element).waitFor()
  await page.locator(element).hover()
}

export const checkLocatorElementIdExist = async (element: string, page: Page) => {
  await page.waitForTimeout(1000)
  const deletes = await page.locator(element)
  if (deletes) {
    await page.locator(element).click()
  }
}

export const verifyGetAttributeLocatorElementId = async (element: string, page: Page, value: string) => {
  await page.waitForTimeout(1000)
  const attributeLocator = await page.locator(element)
  const valueAttribute = await attributeLocator.getAttribute(value)
  expect(valueAttribute).toBeTruthy
}

export const verifyTitlePage = async (page: Page, title: string) => {
  await expect(page).toHaveTitle(title)
}
