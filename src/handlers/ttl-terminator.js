const AWS = require('aws-sdk');
const cfn = new AWS.CloudFormation();

exports.handler = async (event, context) => {
    const report = { DeletedStacks: [], Failure: []};
    try {
        const params = {}
        do {
            const response = await cfn.describeStacks(params).promise();
            
            params.NextToken = response.NextToken;
            (!response.NextToken) && delete params.NextToken;
    
            for (const stack of response.Stacks) {

                const ttl = stack.Tags.find(tag => tag.Key === 'TTL');
                // stack survives only if ttl tag is set and in the future
                if (ttl && Date.parse(ttl.Value) > Date.now()) {
                    continue;
                }

                try {
                    await cfn.deleteStack({ StackName: stack.StackName }).promise();
                    report.DeletedStacks.push(stack)
                    console.info(`stack ${stack.StackId} with TTL ${ttl.Value} deleted`);
                } catch (error) {
                    report.Failure.push(stack);
                    console.warn(`cannot delete stack ${stack.StackId} with TTL ${ttl.value}:`, 
                        error.stack || JSON.stringify(error, null, 2));
                }
            }
        } while (params.NextToken)

        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(report)
        };
    } catch (error) {
        report.Error = error.stack || JSON.stringify(error, null, 2)
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(report)
        }
    }
}
