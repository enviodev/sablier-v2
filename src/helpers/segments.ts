import {
  eventLog,
  SegmentEntity,
  StreamEntity,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV21LockupContract_CreateLockupDynamicStreamEvent_eventArgs,
  SablierV2LockupContract_CreateLockupDynamicStreamEvent_handlerContext,
  SablierV21LockupContract_CreateLockupDynamicStreamEvent_handlerContext,
} from "../src/Types.gen";
import { add } from "./maths";

type SegmentInput = {
  amount: bigint;
  exponent: bigint;
  milestone: bigint;
};

export function createSegment(
  id: string,
  i: number,
  startAmount: bigint,
  last: SegmentInput,
  current: SegmentInput
): SegmentEntity {
  const segmentEntity: SegmentEntity = {
    id: id + "-" + i.toString(),
    stream: id,
    amount: current.amount,
    exponent: current.exponent,
    milestone: current.milestone,
    startTime: last.milestone,
    endTime: current.milestone,
    startAmount: startAmount,
    endAmount: add(startAmount, current.amount),
    position: BigInt(i - 1),
  };

  return segmentEntity;
}

export function createSegments(
  stream: StreamEntity,
  event: eventLog<
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_eventArgs
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_eventArgs
  >,
  context:
    | SablierV2LockupContract_CreateLockupDynamicStreamEvent_handlerContext
    | SablierV21LockupContract_CreateLockupDynamicStreamEvent_handlerContext
): StreamEntity {
  const segments = event.params.segments;

  let streamed = 0n;

  let segmentInput: SegmentInput = {
    amount: 0n,
    exponent: 0n,
    milestone: stream.startTime,
  };

  let inputs: SegmentInput[] = [segmentInput];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    const amount = segment[0] ?? 0n;
    const exponent = segment[1] ?? 0n;
    const milestone = segment[2] ?? 0n;

    let segmentInput: SegmentInput = {
      amount: amount,
      exponent: exponent,
      milestone: milestone,
    };

    inputs.push(segmentInput);
  }

  for (let i = 1; i < inputs.length; i++) {
    let id = stream.id;
    let segment: SegmentEntity = createSegment(
      id,
      i,
      streamed,
      inputs[i - 1],
      inputs[i]
    );

    context.Segment.set(segment);

    streamed = add(streamed, inputs[i].amount);
  }

  return stream;
}
