const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const EnvWithTtl = require('../lib/env-with-ttl-stack');

test('CFN Stack with one bucket and TTL tag', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EnvWithTtl.EnvWithTtlStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {
        "bucketwithttlB72D1F93": {
          "Type": "AWS::S3::Bucket",
          "UpdateReplacePolicy": "Retain",
          "DeletionPolicy": "Retain"
        }
      }
    }, MatchStyle.EXACT))
});
