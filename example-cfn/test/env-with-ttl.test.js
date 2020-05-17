const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const { App, Tag } = require('@aws-cdk/core');
const EnvWithTtl = require('../lib/env-with-ttl-stack');

test('CFN Stack with one bucket and TTL tag', () => {
    const app = new App();
    // WHEN
    const stack = new EnvWithTtl.EnvWithTtlStack(app, 'MyTestStack');
    Tag.add(stack, 'TTL', new Date(Date.parse("2020-01-15T23:15:23.991Z")).toISOString());
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {
        "bucketwithttlB72D1F93": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "Tags": [
              {
                "Key": "TTL",
                "Value": "2020-01-15T23:15:23.991Z"
              }
            ]
          },
          "UpdateReplacePolicy": "Retain",
          "DeletionPolicy": "Retain"
        }
      }
    }, MatchStyle.EXACT))
});
