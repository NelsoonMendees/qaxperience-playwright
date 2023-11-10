import { expect, test } from "@playwright/test";
import { TaskModel } from "./fixtures/task.model";
import data from "./fixtures/tasks.json";
import { deleteTaskByHelper, postTask } from "./support/helpers";
import { TasksPage } from "./support/pages/tasks";

let tasksPage: TasksPage;

test.beforeEach(({ page }) => {
  tasksPage = new TasksPage(page);
});

test.describe("Cadastro", async () => {
  test("Deve cadastrar uma nova tarefa", async ({ request }) => {
    const task = data.success as TaskModel;

    await deleteTaskByHelper(request, task.name);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.shouldHaveText(task.name);
  });

  test("Não deve cadastrar tarefa duplicada", async ({ request }) => {
    const task = data.duplicate as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await postTask(request, task);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.alertHaveText("Task already exists!");
  });

  test("Campo obrigatório", async () => {
    const task = data.required as TaskModel;

    await tasksPage.go();
    await tasksPage.create(task);

    const validationMessage = await tasksPage.inputTaskName.evaluate(
      (e) => (e as HTMLInputElement).validationMessage
    );

    expect(validationMessage).toEqual("This is a required field");
  });
});

test.describe("Atualização", async () => {
  test("Deve concluir uma tarefa", async ({ request }) => {
    const task = data.update as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await postTask(request, task);

    await tasksPage.go();

    await tasksPage.toggle(task.name);

    await tasksPage.shoulBeDone(task.name);
  });
});

test.describe("Exclusão", async () => {
  test("Deve excluir uma tarefa", async ({ request }) => {
    const task = data.delete as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await postTask(request, task);

    await tasksPage.go();

    await tasksPage.removeTask(task.name);

    await tasksPage.shoulNotExist(task.name);
  });
});
