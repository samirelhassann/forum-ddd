import { AnswerAttachmentList } from "./AnswerAttachmentList";
import { AnswerCreatedEvent } from "./events/AnswerCreatedEvent";
import { AggregateRoot } from "@/core/entities/AggregateRoot";
import { UniqueEntityId } from "@/core/entities/UniqueEntityId";
import { Optional } from "@/core/types/optional";

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  constructor(
    props: Optional<AnswerProps, "createdAt" | "attachments">,
    id?: UniqueEntityId
  ) {
    super(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      this.addDomainEvent(new AnswerCreatedEvent(this));
    }
  }

  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
