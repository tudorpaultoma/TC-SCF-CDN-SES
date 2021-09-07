# TC-SCF-CDN-SES
Tencent Cloud SES Notification on CDN traffic consumption

This nodeJS script can be run from a Serverless Function in Tencent Cloud to periodically send emails about the traffic consumption of the CDN
The script can run under a sub-user account which only has permissions to work with CDN/SES or under a role name which grants only these specific permissions.

More details:

SCF: https://intl.cloud.tencent.com/document/product/583

CDN: https://intl.cloud.tencent.com/document/product/228

SES: https://intl.cloud.tencent.com/document/product/1084

Tencent Cloud SDK for NodeJS: https://github.com/TencentCloud/tencentcloud-sdk-nodejs-intl-en

TBD:
 - add parameter file
 - error handling
 - add comments
 - clean code

Author: Tudor Toma
