# AWS SDK for PHP Sample Project

A simple PHP application illustrating usage of the AWS SDK for PHP.

## Requirements

A `composer.json` file declaring the dependency on the AWS SDK is provided. To
install Composer and the SDK, run:

    curl -sS https://getcomposer.org/installer | php
    php composer.phar install

## Basic Configuration

You need to set your AWS security credentials before the sample is able to
connect to AWS. The SDK will automatically pick up credentials in environment
variables:

    export AWS_ACCESS_KEY_ID="your-aws-access-key-id"
    export AWS_SECRET_KEY="your-aws-secret-access-key"

See the [Security Credentials](http://aws.amazon.com/security-credentials) page
for more information on getting your keys. You can also set your credentials in
a couple of other ways. See the [AWS SDK for PHP documentation](http://docs.aws.amazon.com/aws-sdk-php-2/guide/latest/configuration.html)
for more information.

## Running the S3 sample

This sample application connects to Amazon's [Simple Storage Service (S3)](http://aws.amazon.com/s3),
creates a bucket, and uploads a file to that bucket. The sample code will
generate a bucket name and a file for you, so all you need to do is run the
code:

    php sample.php

The S3 documentation has a good overview of the [restrictions for bucket names](http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html)
for when you start making your own buckets.

## License

This sample application is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

