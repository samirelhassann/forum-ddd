import { makeQuestion } from "test/factories/MakeQuestion";
import { InMemoryQuestionsRepository } from "test/repositories/InMemoryQuestionsRepository";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ListRecentQuestionsUseCase } from "./ListRecentQuestionsUseCase";
import { UniqueEntityId } from "@/core/entities/UniqueEntityId";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/InMemoryQuestionAttachmentsRepository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ListRecentQuestionsUseCase;

describe("List Recent Questions Use Case", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it("should return the most recent question", async () => {
    const question2 = makeQuestion({ createdAt: new Date(2023, 0, 7) });
    const question1 = makeQuestion({ createdAt: new Date(2023, 0, 10) });
    const question3 = makeQuestion({ createdAt: new Date(2023, 0, 15) });

    await inMemoryQuestionsRepository.create(question1);
    await inMemoryQuestionsRepository.create(question2);
    await inMemoryQuestionsRepository.create(question3);

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([question3, question1, question2]);
  });

  it("should return the quantity page correctly", async () => {
    Array.from({ length: 21 }).forEach(async (_, index) => {
      const question = makeQuestion(
        {},
        new UniqueEntityId(`question-${index.toString()}`)
      );
      await inMemoryQuestionsRepository.create(question);
    });

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions.length).toBe(20);
  });
});
