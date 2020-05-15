const AWS = require('aws-sdk');

const mockedDescribeStacks = jest.fn();
const mockedDeleteStack = jest.fn();
AWS.CloudFormation = jest.fn().mockImplementation(() => ({
  describeStacks: mockedDescribeStacks,
  deleteStack: mockedDeleteStack,
}))

const TTLTerminator = require('../../../src/handlers/ttl-terminator.js');
const CloudWatchEvent = require('../../../events/event-cloudwatch-event.json')

describe('when ttl terminator is called', function () {

  const mockedPromise = (promise) => ({
    promise: () => promise
  })

  const mockedError = (error) => ({
    promise: () => Promise.reject(error)
  })

  const mockedStacks = (stacks) => ({
    promise: () => Promise.resolve({
      Stacks: stacks
    })
  });

  const mockedToken = (token) => ({
    promise: () => Promise.resolve({
      Stacks: Array.from([]),
      NextToken: token
    })
  });

  beforeEach(() => {
    mockedDescribeStacks.mockClear();
    mockedDeleteStack.mockClear();
  });

  it('should fail if cloud formation describe stacks fails', async () => {
    // given
    mockedDescribeStacks
      .mockReturnValueOnce(mockedError(new Error('whoops')));

    // when
    const response = await TTLTerminator.handler(CloudWatchEvent, null)

    // then
    expect(JSON.stringify(response)).toMatch(/whoops/);
  });

  it('should delete a stack without TTL tag', async () => {
    // given
    mockedDescribeStacks
      .mockReturnValueOnce(mockedStacks(Array.from([{
        StackName: 'stack name',
        StackId: 'stack id',
        Tags: Array.from([])
      }])));

    // when
    await TTLTerminator.handler(CloudWatchEvent, null)
    // then
    expect(mockedDeleteStack.mock.calls.length).toBe(1);
  });

  it('should delete a stack with expired TTL tag', async () => {
    // given
    mockedDescribeStacks
      .mockReturnValueOnce(mockedStacks(Array.from([{
        StackName: 'stack name',
        StackId: 'stack id',
        Tags: Array.from([{Key: 'TTL', Value: new Date().toISOString() }])
      }])));

    mockedDeleteStack
      .mockReturnValueOnce(mockedPromise(Promise.resolve()));

    // when
    await TTLTerminator.handler(CloudWatchEvent, null)
    // then
    expect(mockedDeleteStack.mock.calls.length).toBe(1);
  });

  it('should not delete a stack with non-expired TTL tag', async () => {
    // given
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    mockedDescribeStacks
      .mockReturnValueOnce(mockedStacks(Array.from([{
        StackName: 'stack name',
        StackId: 'stack id',
        Tags: Array.from([{Key: 'TTL', Value: tomorrow.toISOString() }])
      }])));

    mockedDeleteStack
      .mockReturnValueOnce(mockedPromise(Promise.resolve()));

    // when
    await TTLTerminator.handler(CloudWatchEvent, null)
    // then
    expect(mockedDeleteStack.mock.calls.length).toBe(0);
  });

  it('should page over all stacks', async () => {
    // given
    mockedDescribeStacks
      .mockReturnValueOnce(mockedToken('FIRST'))
      .mockReturnValueOnce(mockedToken('SECOND'));

    // when
    await TTLTerminator.handler(CloudWatchEvent, null)

    // then
    expect(mockedDescribeStacks.mock.calls.length).toBe(3);
  });

});
