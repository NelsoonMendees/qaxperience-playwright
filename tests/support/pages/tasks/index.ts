import { Locator, Page, expect } from "@playwright/test";
import { TaskModel } from "../../../fixtures/task.model";

export class TasksPage {
  readonly page: Page;
  readonly inputTaskName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputTaskName = page.locator('input[class*="listInputNewTask"]');
  }

  async go() {
    await this.page.goto("/");
  }

  async create(task: TaskModel) {
    //formas de digitar o texto no input
    await this.inputTaskName.fill(task.name);
    //   await page.fill("input[class*='listInputNewTask']", "Estudar Playwright");

    //Formas de clicar em submit
    await this.page.click("css=button >> text=Create");
    //   await page.click('button[class*=listButtonNewTask]')
    //   await inputTaskName.press("Enter");
  }

  async toggle(taskName: string) {
    const target = this.page.locator(
      `xpath=//p[text()="${taskName}"]/..//button[contains(@class, "Toggle")]`
    );

    await target.click();
  }

  async removeTask(taskName: string) {
    const target = this.page.locator(
      `xpath=//p[text()="${taskName}"]/..//button[contains(@class, "Delete")]`
    );

    await target.click();
  }

  async shouldHaveText(taskName: string) {
    //Formas de validar locator
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`);
    //   const target = page.getByTestId("task-item");
    //   const target = page.locator(".task-item");

    await expect(target).toBeVisible();
  }

  async alertHaveText(text: string) {
    const target = this.page.locator(".swal2-html-container");

    await expect(target).toHaveText(text);
  }

  async shoulBeDone(taskName: string) {
    const target = this.page.getByText(taskName);

    await expect(target).toHaveCSS("text-decoration-line", "line-through");
  }

  async shoulNotExist(taskName: string) {
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`);

    await expect(target).not.toBeVisible();
  }
}
