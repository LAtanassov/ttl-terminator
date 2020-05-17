const core = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class EnvWithTtlStack extends core.Stack {
  /**
   *
   * @param {core.Construct} scope
   * @param {string} id
   * @param {core.StackProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new s3.Bucket(this, "bucket-with-ttl");
  }
}

module.exports = { EnvWithTtlStack }
