import { expect, Locator, Page } from '@playwright/test';
import { STORAGE_STATE } from '../../playwright.config';
import { text } from 'stream/consumers';
import path from 'path';

export class CommonClassPage {
  readonly page: Page;
  private readonly uiActionPrefix = 'UI Action: ';
  private color: any;
  private colorsInitialized = false;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  private async ensureColorsInitialized() {
    if (!this.colorsInitialized) {
      const chalk = await import('chalk');
      this.color = {
        success: chalk.default.bold.hex('#0EF15D'),
        error: chalk.default.bold.hex('#E4271B'),
      };
      this.colorsInitialized = true;
    }
  }
  
  // Simple wrapper function instead of step to avoid circular dependencies
  private async withStep<T>(name: string, callback: () => Promise<T>): Promise<T> {
    await this.ensureColorsInitialized();
    try {
      console.log(this.color.success(`Starting: ${name}`));
      const result = await callback();
      console.log(this.color.success(`Completed: ${name}`));
      return result;
    } catch (error) {
      console.log(this.color.error(`Failed: ${name}`));
      throw error;
    }
  }
  
  async gotoUrl(url: string) {
    await this.withStep(`${this.uiActionPrefix}Navigate to URL: ${url}`, async () => {
      await this.page.goto(url);
      await this.waitForPageLoad();
    });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('load')
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(500)
  }

  async refreshPage() {
    await this.withStep(`${this.uiActionPrefix}Refreshes page`, async () => {
      await this.page.reload()
      await this.page.waitForLoadState('load')
      await this.page.waitForLoadState('domcontentloaded')
      await this.page.waitForLoadState('networkidle')
      await this.page.waitForTimeout(1000)
    })
  }

  async saveAuthentication() {
    await this.withStep(`${this.uiActionPrefix}Saves authentication state`, async () => {
      await this.page.context().storageState({ path: STORAGE_STATE });
      return STORAGE_STATE;
    })
  }
  
  async clickLocatorElement(element: string) {
    await this.withStep(`${this.uiActionPrefix}Click element: ${element}`, async () => {
      const locator = this.page.locator(element);
      await locator.scrollIntoViewIfNeeded();
      await this.page.evaluate(() => window.scrollBy(0, -200));
      try {
        await locator.click({ force: true, timeout: 3000 });
      } catch {
        await locator.evaluate((el) => (el as HTMLElement).click());
      }
    });
  }

  async clickLocatorElementToLoadPage(element: string) {
    await this.withStep(`${this.uiActionPrefix}Click element to load page: ${element}`, async () => {
      const locator = this.page.locator(element);
      await locator.scrollIntoViewIfNeeded();
      await this.page.evaluate(() => window.scrollBy(0, -200));
      try {
        await locator.click({ force: true, timeout: 3000 });
      } catch {
        await locator.evaluate((el) => (el as HTMLElement).click());
      }
      await this.waitForPageLoad();
    });
  }

  async fillLocatorElement(element: string, value: string) {
    await this.withStep(`${this.uiActionPrefix}Fill element: ${element} with value: ${value}`, async () => {
      await this.page.locator(element).fill(value);
    });
  }

  async verifyToBeVisible(element: string) {
    await this.withStep(`${this.uiActionPrefix}Verify element is visible: ${element}`, async () => {
      await expect(this.page.locator(element)).toBeVisible();
    });
  }

  async waitForSelector(element: string) {
    await this.withStep(`${this.uiActionPrefix}Wait for selector: ${element}`, async () => {
      await this.page.locator(element).waitFor();
    });
  }

    async clickToElement(element: string) {
      await this.withStep(`${this.uiActionPrefix}Click to element: ${element}`, async () => {
        await this.page.waitForTimeout(2000)
        await this.page.locator(element).scrollIntoViewIfNeeded()
        await this.page.locator(element).click()
      })
    }

  async dblclickToElement(element: string) {
    await this.withStep(`${this.uiActionPrefix}Double click to element: ${element}`, async () => {
      await this.page.waitForTimeout(2000)
      await this.page.locator(element).dblclick()
    })
  }

  async countElement(element: string, count: number) {
    await this.withStep(`${this.uiActionPrefix}Count element: ${element} with count: ${count}`, async () => {
      await expect(this.page.locator(element)).toHaveCount(count)
    })
  }

  async setValue(element: string, text: string) {
    await this.withStep(`${this.uiActionPrefix}Set value to element: ${element}`, async () => {
      await this.page.locator(element).fill(text)
      await this.page.waitForTimeout(2000)
    })
  }

  async clearValue(element: string) {
    await this.withStep(`${this.uiActionPrefix}Clear value of element: ${element}`, async () => {
      await this.page.locator(element).fill('');
    })
  }

  async hoverToElement(element: string) {
    await this.withStep(`${this.uiActionPrefix}Hover to element: ${element}`, async () => {
      await this.page.locator(element).hover()
    })
  }

  async dragToElement(element: string, elementTarget: string) {
    await this.withStep(`${this.uiActionPrefix}Drag element: ${element} to element: ${elementTarget}`, async () => {
      await this.page.locator(element).dragTo(this.page.locator(elementTarget), { force: true, targetPosition: { x: 100, y: 100 } })
    })
  }

  async fillToElement(element: string, text: string) {
    await this.withStep(`${this.uiActionPrefix}Fill element: ${element} with text: ${text}`, async () => {
      await this.page.locator(element).fill(text);
    })
  }

  async dragAndDrop(selector: string, targetSelector: string) {
    // // Get the source element
    // const source = this.page.locator(selector)

    // // Get the target element
    // const target = this.page.locator(targetSelector)

    // Get the bounding boxes of the source and target elements
    const sourceBox = await this.page.locator(selector).boundingBox()
    const targetBox = await this.page.locator(targetSelector).boundingBox()

    // Check that both bounding boxes exist
    if (!sourceBox || !targetBox) {
      throw new Error('Could not find source or target element')
    }

    // Calculate the center point of the source element
    const sourceX = sourceBox.x + sourceBox.width / 2
    const sourceY = sourceBox.y + sourceBox.height / 2

    // Calculate the center point of the target element
    const targetX = targetBox.x + targetBox.width / 2
    const targetY = targetBox.y + targetBox.height / 2

    // Drag and drop the source element to the target element
    await this.page.waitForTimeout(2000)
    await this.page.mouse.move(sourceX, sourceY)
    await this.page.mouse.down()
    await this.page.waitForTimeout(2000)
    await this.page.mouse.move(targetX, targetY)
    await this.page.waitForTimeout(2000)
    await this.page.mouse.up()
  }

  async waitForElement(element: string, status: 'attached' | 'detached' | 'visible' | 'hidden', number: number) {
    await this.withStep(`${this.uiActionPrefix}Wait for element: ${element} with status: ${status} and timeout: ${number}`, async () => {
      await this.page.locator(element).waitFor({ state: status, timeout: number })
    })
  }

  async verifyElementState(element: string, state: any, isShow: string) {
    let value
    switch (state) {
      case 'isChecked':
        value = await this.page.locator(element).isChecked()
        break
      case 'isEnabled':
        value = await this.page.locator(element).isEnabled()
        break
      case 'isEditable':
        value = await this.page.locator(element).isEditable()
        break
      case 'isHidden':
        value = await this.page.locator(element).isHidden()
        break
      case 'isDisabled':
        value = await this.page.locator(element).isDisabled()
        break
      default:
        value = await this.page.locator(element).isVisible()
    }
    console.log({ value });

    if (isShow == 'displayed') {
      expect(value).toEqual(true)
    } else {
      expect(value).toEqual(false)
    }
  }

  async mouseWheel(deltaX: number, deltaY: number) {
    await this.withStep(`${this.uiActionPrefix}Mouse wheel: deltaX=${deltaX}, deltaY=${deltaY}`, async () => {
      await this.page.mouse.wheel(deltaX, deltaY)
    })
  }

  async mouseMove(deltaX: number, deltaY: number) {
    await this.withStep(`${this.uiActionPrefix}Mouse move: deltaX=${deltaX}, deltaY=${deltaY}`, async () => {
      await this.page.mouse.move(deltaX, deltaY)
    })
  }

  async keyboardDown(keyboard: string) {
    await this.withStep(`${this.uiActionPrefix}Keyboard down: ${keyboard}`, async () => {
      await this.page.keyboard.down(keyboard)
    })
  }

  async keyboardUp(keyboard: string) {
    await this.withStep(`${this.uiActionPrefix}Keyboard up: ${keyboard}`, async () => {
      await this.page.keyboard.up(keyboard)
    })
  }

  async keyboardPress(keyboard: string) {
    await this.withStep(`${this.uiActionPrefix}Keyboard press: ${keyboard}`, async () => {
      await this.page.keyboard.press(keyboard)
    })
  }

  async pause(milliseconds: number) {
    await this.withStep(`${this.uiActionPrefix}Pause for ${milliseconds} milliseconds`, async () => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds))
    })
  }

  async imageComparisons() {
    await this.withStep(`${this.uiActionPrefix}Take screenshot`, async () => {
      await this.page.waitForTimeout(2000)
      await expect(this.page).toHaveScreenshot()
    })
  }

  async clickMouse(x: number, y: number, position: 'left' | 'right' | 'middle' | undefined = 'left') {
    await this.withStep(`${this.uiActionPrefix}Mouse click at (${x}, ${y}) with button ${position}`, async () => {
      await this.page.mouse.click(x, y, { button: position })
    })
    
  }

  async mouseDown() {
    await this.withStep(`${this.uiActionPrefix}Mouse down`, async () => {
      await this.page.mouse.down()
    })
  }

  async mouseUp() {
    await this.withStep(`${this.uiActionPrefix}Mouse up`, async () => {
      await this.page.mouse.up()
    })
  }

  async scrollToElement(element: string) {
    await this.withStep(`${this.uiActionPrefix}Scroll to element: ${element}`, async () => {
      await this.page.waitForTimeout(2000)
      await this.page.locator(element).scrollIntoViewIfNeeded()
    })
    
  }

  async toHaveText(element: string, text: string, isShow: boolean) {
    await this.withStep(`${this.uiActionPrefix}Verify text of element: ${element}`, async () => {
      if (isShow) {
      expect(this.page.locator(element)).toHaveText(text)
      } else {
        expect(this.page.locator(element)).not.toHaveText(text)
      }
    })
  }

  async toHaveValue(element: string, text: string, isShow: boolean) {
    await this.withStep(`${this.uiActionPrefix}Verify value of element: ${element}`, async () => {
      if (isShow) {
      expect(this.page.locator(element)).toHaveValue(text)
      } else {
        expect(this.page.locator(element)).not.toHaveValue(text)
      }
    })
  }

  async getContent(element: string) {
    await this.withStep(`${this.uiActionPrefix}Get content of element: ${element}`, async () => {
      return (await this.page.locator(element).textContent()) || (await this.page.locator(element).getAttribute('value')) || 'no data'
    })
  }

  async compareText(value1: string, value2: string) {
    await this.withStep(`${this.uiActionPrefix}Compare text: ${value1} and ${value2}`, async () => {
      expect(value1).toEqual(value2)
    })
  }

  async uploadFileData(element: string, value: string) {
    await this.withStep(`${this.uiActionPrefix}Upload file: ${value} for element: ${element}`, async () => {
      const fileToUpload = '/dataTest/' + value
      const absolutePath = path.resolve(process.cwd() + fileToUpload)
      await this.page.locator(element).setInputFiles(absolutePath)
      await this.page.waitForTimeout(2000)
    })
  }

  async arrowDownEnterKeyBoard() {
    await this.withStep(`${this.uiActionPrefix}Select option using arrow keys`, async () => {
      await this.page.waitForTimeout(2000)
      await this.page.keyboard.press('ArrowDown')
      await this.page.keyboard.press('Enter')
    })
  }

   async selectOption(element: string, value: string) {
    await this.withStep(`${this.uiActionPrefix}Select option: ${value} for element: ${element}`, async () => {
      await this.page.selectOption(element, value);
    })
  }

}
