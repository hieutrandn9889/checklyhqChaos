import { expect } from '@playwright/test';
import { CommonClassPage } from '../commons/commonClassPage';
import ProjectPageUI from '../interfaces/projectPageUI';


export class ProjectPage extends CommonClassPage {

  async checkDashboardProject() {
    await expect(this.page.locator(ProjectPageUI.checkDashboardProject)).toBeVisible({ timeout: 10000 });
  }

  async clickProjectAndCreateTicket() {
      await this.clickLocatorElement(ProjectPageUI.hieutranTest1Project)
      await this.clickLocatorElement(ProjectPageUI.createTicketButton)
      await this.fillLocatorElement(ProjectPageUI.inputSummaryTicket, 'Test Ticket Summary')
      await this.selectOption(ProjectPageUI.selectRecordTimingType, 'OTT.0002')
      console.log('Selected Record Timing Type: OTT.0002')
      // await this.selectOption(ProjectPageUI.selectRecordTimingType, 'OTT.0002')
      // await this.fillLocatorElement(ProjectPageUI.selectRecordTimingType, 'Post Incident')
      // await this.arrowDownEnterKeyBoard()
    }


}


