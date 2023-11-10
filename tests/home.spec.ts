import { test, expect } from "@playwright/test";
import { TasksPage } from "./support/pages/tasks";

test("Webapp deve estar online", async ({ page }) => {
  const tasksPage: TasksPage = new TasksPage(page);

  await tasksPage.go();

  await expect(page).toHaveTitle("Gerencie suas tarefas com Mark L");
});
