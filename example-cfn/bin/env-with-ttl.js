#!/usr/bin/env node

const { App, Tag } = require('@aws-cdk/core');
const { EnvWithTtlStack } = require('../lib/env-with-ttl-stack');

const app = new App();
const stack = new EnvWithTtlStack(app, 'EnvWithTtlStack');

Tag.add(stack, 'TTL', new Date().toISOString());